import { Stream, PassThrough } from "stream";
import { IStateManager, newStateManager } from "./stateManager";

export interface IStreamState {
	_sinks: Stream[];
}

const streams: Stream[] = [new PassThrough()];
