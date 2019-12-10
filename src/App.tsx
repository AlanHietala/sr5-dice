import React, { useReducer } from 'react';
import './App.css';
import Pool from './Pool';
import appReducer, { DicePool, Actions } from './appReducer';

interface AppState {
	dicePools: Array<DicePool>;
}

const initialState: AppState = {
	dicePools: [
		{
			name: 'pool1',
			poolSize: '10',
			poolModifier: '0',
			isExploding: false,
			rolls: [],
			hits: 0,
		},
	],
};

const App: React.FC = () => {
	const [state, dispatch] = useReducer(appReducer, initialState);
	return (
		<div className="App">
			<button
				className="btn-action"
				onClick={() => dispatch({ type: Actions.AddPool, payload: {} })}
			>
				Add Pool
			</button>
			{state.dicePools.map((pool, index) => (
				<div key={index} className="pool-wrap">
					<Pool state={pool} dispatch={dispatch} key={index} id={index} />
					<button
						className="btn-action"
						onClick={() => dispatch({ type: Actions.RemovePool, payload: { index } })}
					>
						Remove
					</button>
				</div>
			))}
		</div>
	);
};

export default App;
