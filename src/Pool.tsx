import React, { useReducer, Reducer, useEffect } from 'react';
import { DicePool, Action, Actions } from './appReducer';

interface DicePoolComponent {
	state: DicePool;
	dispatch: React.Dispatch<Action>;
	id: number;
}

const Pool: React.FC<DicePoolComponent> = ({ dispatch, state, id }) => {
	return (
		<div>
			<div className="pool-name">
				<input
					value={state.name}
					onChange={event =>
						dispatch({ type: Actions.SetName, payload: { name: event.target.value, index: id } })
					}
				/>
			</div>
			<div className="pool-row">
				Pool Size:{' '}
				<input
					value={state.poolSize || ''}
					onChange={event =>
						dispatch({
							type: Actions.SetPoolSize,
							payload: { index: id, poolSize: event.target.value },
						})
					}
				/>
			</div>
			<div className="pool-row">
				Modifier:
				<input
					value={state.poolModifier || ''}
					onChange={event =>
						dispatch({
							type: Actions.SetPoolModifier,
							payload: { index: id, poolModifier: event.target.value },
						})
					}
				/>
			</div>
			<div className="pool-row">
				explode
				<input
					checked={state.isExploding}
					type="checkbox"
					onChange={() => dispatch({ type: Actions.ToggleExploding, payload: { index: id } })}
				/>
				<button onClick={event => dispatch({ type: Actions.Roll, payload: { index: id } })}>
					Roll!
				</button>
			</div>
			<div className="pool-row">
				{state.rolls.map(roll => roll.value).join(', ')} | {state.hits} Hits
			</div>
			<div className="pool-row">
				{state.rolls.length > 0 && (
					<button onClick={() => dispatch({ type: Actions.RerollMisses, payload: { index: id } })}>
						Reroll Misses
					</button>
				)}
			</div>
		</div>
	);
};

export default Pool;
