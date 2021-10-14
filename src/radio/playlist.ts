import { sha256, throwErr } from "../util";

export interface ISong {
	/**
	 * The song's ID. Usually a hash of a URL or filepath.
	 */
	id: string;
	/**
	 * Song file name (ex: song.mp3)
	 */
	name: string;
	/**
	 * Song bitrate in bits.
	 */
	bitrate?: number;
	/**
	 * Song duration in seconds.
	 */
	duration?: number;
}

export interface IPlaylist {
	/**
	 * The current song playing.
	 */
	currentSong: ISong | null;
	/**
	 * A decimal (0.0 -> 1.0) representing how much of the song has progressed.
	 */
	currentSongProgress: number;
	/**
	 * A map of times (HH:HH) and songs.
	 */
	schedule: {
		startTime: string;
		song: ISong;
	}[];
}

export type IFormattedSchedules = [number, ISong][];

/**
 * Creates and returns a new IPlaylist with no schedule loaded.
 */
export const newPlaylist = (): IPlaylist => ({
	currentSong: null,
	currentSongProgress: 0.0,
	schedule: [],
});

/**
 * Converts schedule to relative timestamps and returns it as a list of tuples
 * of unix timestamps and songs.
 */
const getScheduleAsTimestamps = (playlist: IPlaylist): IFormattedSchedules =>
	playlist.schedule
		? playlist.schedule.map(({ startTime, song }) => {
				const [hour, minute] = startTime
					.split(":")
					.map((x: string) => parseInt(x));
				if (hour === null || minute === null)
					throwErr(`Invalid format for song ${startTime} => ${song}`);

				let date = new Date();
				date.setUTCHours(hour, minute, 0, 0);

				return [date.getTime(), song];
		  })
		: throwErr(`playlist.schedule returned null`);

/**
 * Returns the next song, if one exists.
 */
export const getNextSong = (playlist: IPlaylist): [number, ISong] | null => {
	const schedule = getScheduleAsTimestamps(playlist);
	const now = Date.now();
	const relativeSchedule = schedule
		.map(([time, song]) => [time - now, song])
		.sort((a: any, b: any) => Math.abs(a[0]) - Math.abs(b[0]));

	if (playlist.currentSong !== null)
		return (
			(relativeSchedule.filter(([time]) => time >= 0)[0] as [number, ISong]) ||
			null
		);

	return (
		(relativeSchedule.filter(([time]) => time <= 0)[0] as [number, ISong]) ||
		null
	);
};

/**
 * Checks if the next song is ready to be played, returning it if it is.
 */
export const pollNextSong = async (
	playlist: IPlaylist
): Promise<[ISong | null, IPlaylist]> => {
	const nextSong = getNextSong(playlist);
	if (
		!nextSong ||
		nextSong[0] > 500 ||
		(playlist.currentSong && nextSong[1].id == playlist.currentSong.id)
	)
		return [null, playlist];

	return [
		nextSong[1],
		{
			...playlist,
			currentSong: nextSong[1],
		},
	];
};

export const loadPlaylistFromJson =
	(json: {
		schedule: {
			startTime: string;
			song: string;
		}[];
	}) =>
	async (playlist: IPlaylist): Promise<IPlaylist> => ({
		...playlist,
		schedule: await Promise.all(
			json.schedule.map(async ({ startTime, song }) => ({
				startTime,
				song: {
					id: await sha256(`${song}-${startTime}`),
					name: song,
				},
			}))
		),
	});
