import { Reducer } from 'react';

export enum Actions {
	AddPool = 'addPool',
	RemovePool = 'removePool',
	SetName = 'setName',
	RerollMisses = 'rerollMisses',
	ToggleExploding = 'toggleExploding',
	SetPoolModifier = 'setPoolModifier',
	Roll = 'roll',
	SetPoolSize = 'setPoolSize',
}

export interface DicePool {
	isExploding: boolean;
	name: string;
	poolSize: string;
	rolls: Array<Roll>;
	hits: number;
	poolModifier: string;
}
export interface Roll {
	value: number;
	isExploded: boolean;
}

export interface Action {
	type: string;
	payload: any;
}

interface AppState {
	dicePools: Array<DicePool>;
}

const rollNDice = (
	numberOfDice: number,
	shouldExplode: boolean,
	fromExploded: boolean
): Array<Roll> => {
	const rolls = [];
	let explodedCount = 0;
	for (let x = 0; x < numberOfDice; x++) {
		rolls[x] = {
			value: Math.floor(Math.random() * 6) + 1,
			isExploded: fromExploded,
		};
		if (rolls[x].value === 6) {
			explodedCount += 1;
		}
	}
	if (shouldExplode && explodedCount > 0) {
		return rolls.concat(rollNDice(explodedCount, true, true));
	}
	return rolls;
};

const calcHits = (rolls: Array<Roll>): number => {
	let hits = 0;
	rolls.forEach(roll => {
		if (roll.value >= 5) {
			hits = hits + 1;
		}
	});
	return hits;
};

const reducer: Reducer<AppState, Action> = (state: AppState, action: Action) => {
	switch (action.type) {
		case Actions.AddPool:
			return {
				...state,
				dicePools: [
					...state.dicePools,
					{
						name: 'new pool',
						poolSize: '10',
						poolModifier: '0',
						isExploding: false,
						rolls: [],
						hits: 0,
					},
				],
			};
		case Actions.RemovePool:
			return {
				...state,
				dicePools: [
					...state.dicePools.slice(0, action.payload.index),
					...state.dicePools.slice(action.payload.index + 1),
				],
			};
		case Actions.SetName:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						return {
							...dicePool,
							name: action.payload.name,
						};
					}

					return dicePool;
				}),
			};
		case Actions.RerollMisses:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						const rolls: Array<Roll> = dicePool.rolls.map(roll => {
							if (roll.value < 5) {
								return rollNDice(1, false, false)[0];
							}
							return roll;
						});
						const hits = calcHits(rolls);

						return {
							...dicePool,
							rolls,
							hits,
						};
					}
					return dicePool;
				}),
			};
		case Actions.ToggleExploding:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						return {
							...dicePool,
							isExploding: !dicePool.isExploding,
						};
					}
					return dicePool;
				}),
			};
		case Actions.SetPoolModifier:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						return {
							...dicePool,
							poolModifier: action.payload.poolModifier,
						};
					}
					return dicePool;
				}),
			};
		case Actions.Roll:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						const poolSizeInt = parseInt(dicePool.poolSize, 10);
						const poolModifierInt = parseInt(dicePool.poolModifier, 10);

						if (!isNaN(poolSizeInt) && !isNaN(poolModifierInt)) {
							const modifiedPool = poolSizeInt + poolModifierInt;
							const rolls = rollNDice(modifiedPool, dicePool.isExploding, false);
							const hits = calcHits(rolls);
							return { ...dicePool, rolls, hits };
						}
						return dicePool;
					}
					return dicePool;
				}),
			};

		case Actions.SetPoolSize:
			return {
				...state,
				dicePools: state.dicePools.map((dicePool, index) => {
					if (index === action.payload.index) {
						return { ...dicePool, poolSize: action.payload.poolSize };
					}
					return dicePool;
				}),
			};
		default:
			return state;
	}
};

export default reducer;
