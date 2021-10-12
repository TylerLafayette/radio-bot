import { Mutex } from "async-mutex";

export interface IStateManager<T> {
	getState: () => Promise<T>;
	setState: (value: T) => Promise<void>;
}

export const newStateManager = <T>(initialValue: T): IStateManager<T> => {
	let _value: T = initialValue;
	let _mutex: Mutex = new Mutex();

	const getState = async (): Promise<T> => {
		const release = await _mutex.acquire();
		const value = _value;
		release();

		return value;
	};

	const setState = async (value: T): Promise<void> => {
		const release = await mutex.acquire();
		try {
			_value = value;
		} finally {
			release();
		}
	};

	return {
		getState,
		setState,
	};
};
