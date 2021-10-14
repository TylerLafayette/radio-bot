import EventEmitter from "events";
import { Stream, PassThrough, Writable, Readable } from "stream";
import {
	IStateManager,
	newStateManager,
	transformStateAsync,
} from "./stateManager";
import Throttle from "throttle";
import { createReadStream } from "fs";
import { ffprobe } from "@dropb/ffprobe";

export interface IStreamState {
	subscriptions: Writable[];
	song: string;
	stream: Readable | null;
	bitrate: number;
	throttle: Throttle | null;
	quit: boolean;
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
		throttle: null,
		quit: false,
	} as IStreamState);

const streamLoop = async (sm: TStreamManager): Promise<void> => {
	const s = await sm.getState();

	if (s.stream === null) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return streamLoop(sm);
	}

	const bytes = s.stream.read(s.bitrate / 8);

	if (s.stream.readableLength < 1) {
		await setSong(s.song)(sm);
	} else {
		(await sm.getState()).subscriptions.forEach((sink) => sink.write(bytes));
	}

	await new Promise((resolve) => setTimeout(resolve, 1000));
	streamLoop(sm);
};

export const startStreaming = streamLoop;

const getBitrate = async (song: string): Promise<number> =>
	parseInt((await ffprobe(`${song}`)).format.bit_rate) as number;

const _setSong =
	(song: string) =>
	async (s: IStreamState): Promise<IStreamState> => {
		const stream = createReadStream(song);
		// Why is this necessary ???
		stream.read(0);
		const bitrate = await getBitrate(song);
		return {
			...s,
			song,
			stream,
			bitrate,
			throttle: new Throttle(bitrate / 8),
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
