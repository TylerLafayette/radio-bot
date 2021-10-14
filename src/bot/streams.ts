import { IBot } from ".";
import { getServerPlaylistByServerId } from "../data/service";
import {
  loadPlaylist,
  newStreamManager,
  startStreaming,
  TStreamManager,
} from "../radio";
import { transformStateAsync } from "../radio/stateManager";
import { getStream, putStream } from "../radio";

const createAndReturnStream =
  (bot: IBot) =>
  async (serverId: string): Promise<TStreamManager> => {
    const serverPlaylist = await getServerPlaylistByServerId(bot.db)(serverId);
    const playlist = JSON.parse(serverPlaylist.playlist);
    const streamManager = newStreamManager();
    await loadPlaylist(playlist)(streamManager);
    await startStreaming(streamManager);

    await putStream(serverId, streamManager)(bot.streamPool);

    return streamManager;
  };

export const getServerStream =
  (bot: IBot) =>
  async (serverId: string): Promise<TStreamManager> =>
    (await getStream(serverId)(bot.streamPool)) ||
    createAndReturnStream(bot)(serverId);
