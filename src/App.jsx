import { useReducer } from 'react';
import { gameReducer, initialState } from './state/gameReducer.js';
import StatusBar from './components/StatusBar.jsx';
import StartScreen from './components/StartScreen.jsx';
import ListingScreen from './components/ListingScreen.jsx';
import ConditionCheckScreen from './components/ConditionCheckScreen.jsx';
import InspectScreen from './components/InspectScreen.jsx';
import PriceScreen from './components/PriceScreen.jsx';
import PriceRevealScreen from './components/PriceRevealScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { phase } = state;

  return (
    <main className="app">
      {phase !== 'start' && phase !== 'result' && <StatusBar state={state} />}
      {phase === 'start' && <StartScreen dispatch={dispatch} />}
      {phase === 'listing' && <ListingScreen state={state} dispatch={dispatch} />}
      {phase === 'check' && <ConditionCheckScreen state={state} dispatch={dispatch} />}
      {phase === 'inspect' && <InspectScreen state={state} dispatch={dispatch} />}
      {phase === 'price' && <PriceScreen state={state} dispatch={dispatch} />}
      {phase === 'priceReveal' && <PriceRevealScreen state={state} dispatch={dispatch} />}
      {phase === 'result' && <ResultScreen state={state} dispatch={dispatch} />}
    </main>
  );
}
