import EventEmitter from "events";
import { Stream, PassThrough, Writable, Readable } from "stream";
import {
	IStateManager,
	newStateManager,
	transformStateAsync,
} from "./stateManager";
import { createReadStream } from "fs";
import { ffprobe } from "@dropb/ffprobe";
import {
	IPlaylist,
	loadPlaylistFromJson,
	newPlaylist,
	pollNextSong,
} from "./playlist";
import { universalStream } from "../util";

export interface IStreamState {
	subscriptions: Writable[];
	song: string;
	stream: Readable | null;
	bitrate: number;
	quit: boolean;
	playlist: IPlaylist;
}

export type TStreamManager = IStateManager<IStreamState>;
export type TStreamAsyncTransformer = (
	input: IStreamState
) => Promise<IStreamState>;

export const newStreamManager = (): TStreamManager =>
	newStateManager({
		subscriptions: [],
		song: "",
		stream: null,
		bitrate: 48000,
		quit: false,
		playlist: newPlaylist(),
	} as IStreamState);

const streamLoop = async (sm: TStreamManager): Promise<void> => {
	const s = await sm.getState();

	const [song, playlist] = await pollNextSong(s.playlist);
	if (song !== null) {
		await mutatePlaylistAsync(async (_) => playlist)(sm);
		await setSong(song.name)(sm);
	}

	if (s.stream !== null) {
		const bytes = s.stream.read(s.bitrate / (8 * 4));

		(await sm.getState()).subscriptions
			.filter(({ writable }) => writable) // Filter out closed or destroyed streams.
			.forEach((sink) => sink.write(bytes)); // Push bytes to each stream.
	}

	await new Promise((resolve) => setTimeout(resolve, 250));
	streamLoop(sm);
};

/**
 * Starts the main stream loop for the given `TStreamManager`.
 */
export const startStreaming = streamLoop;

const getBitrate = async (song: string): Promise<number> =>
	parseInt((await ffprobe(`${song}`)).format.bit_rate) as number;

const _setSong =
	(song: string) =>
	async (s: IStreamState): Promise<IStreamState> => {
		const stream = await universalStream(song);
		// Why is this necessary ???
		stream.read(0);
		const bitrate = await getBitrate(song);
		return {
			...s,
			song,
			stream,
			bitrate,
		};
	};

export const setSong = (song: string) => transformStateAsync(_setSong(song));

const _subscribe =
	(writable: Writable) =>
	async (s: IStreamState): Promise<IStreamState> => ({
		...s,
		subscriptions: [...s.subscriptions, writable],
	});

export const subscribe = (writable: Writable) =>
	transformStateAsync(_subscribe(writable));

/**
 * Creates a function for mutating a playlist instead of a TStreamManager.
 */
export const mutatePlaylistAsync = (
	f: (playlist: IPlaylist) => Promise<IPlaylist>
) =>
	transformStateAsync(
		async (s: IStreamState): Promise<IStreamState> => ({
			...s,
			playlist: await f(s.playlist),
		})
	);

/**
 * Load a playlist from a json schedule.
 */
export const loadPlaylist = (json: {
	schedule: {
		startTime: string;
		song: string;
	}[];
}) => mutatePlaylistAsync(loadPlaylistFromJson(json));
