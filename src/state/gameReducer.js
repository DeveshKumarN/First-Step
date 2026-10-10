import { LISTINGS } from '../data/listings.js';
import { INSPECTIONS_PER_HOUSE } from '../utils/inspection.js';
import { priceVerdict } from '../utils/valuation.js';

const freshRound = (listing = LISTINGS[0]) => ({
  conditionAnswers: {},
  checkSkipped: false,
  inspectLeft: INSPECTIONS_PER_HOUSE,
  inspected: [],
  selected: null,
  priceGuess: listing.list,
  priceResult: null,
});

export const initialState = {
  phase: 'start',
  round: 0,
  buyerIQ: 0,
  pricingPoints: 0,
  history: [],
  ...freshRound(LISTINGS[0]),
};

function conditionSummary(state, listing) {
  const checked = Object.keys(state.conditionAnswers || {}).length;
  const correct = listing.checks.filter((c) => state.conditionAnswers?.[c.id] === c.correct).length;
  return { checked, correct, total: listing.checks.length, skipped: state.checkSkipped };
}

export function gameReducer(state, action) {
  const listing = LISTINGS[state.round];

  switch (action.type) {
    case 'START':
      return { ...initialState, ...freshRound(LISTINGS[0]), phase: 'listing' };

    case 'GO_CHECK':
      return { ...state, phase: 'check', checkSkipped: false };

    case 'RUSH_TO_PRICE':
      return {
        ...state,
        ...freshRound(listing),
        checkSkipped: true,
        phase: 'price',
        priceGuess: listing.list,
      };

    case 'ANSWER_CHECK': {
      if (state.conditionAnswers[action.id]) return state;
      const check = listing.checks.find((c) => c.id === action.id);
      if (!check) return state;
      const correct = action.choice === check.correct;
      return {
        ...state,
        conditionAnswers: { ...state.conditionAnswers, [action.id]: action.choice },
        buyerIQ: state.buyerIQ + (correct ? 10 : 0),
      };
    }

    case 'GO_INSPECT':
      return { ...state, phase: 'inspect' };

    case 'INSPECT':
      if (state.inspected.includes(action.id)) return { ...state, selected: action.id };
      if (state.inspectLeft <= 0) return state;
      return {
        ...state,
        inspected: [...state.inspected, action.id],
        inspectLeft: state.inspectLeft - 1,
        selected: action.id,
      };

    case 'GO_PRICE':
      return { ...state, phase: 'price', priceGuess: listing.list };

    case 'SET_PRICE':
      return { ...state, priceGuess: action.price };

    case 'SUBMIT_PRICE': {
      const result = priceVerdict(listing, state.priceGuess);
      return {
        ...state,
        priceResult: result,
        pricingPoints: state.pricingPoints + result.points,
        phase: 'priceReveal',
      };
    }

    case 'NEXT_CASE': {
      const summary = conditionSummary(state, listing);
      const entry = {
        id: listing.id,
        name: listing.name,
        guess: state.priceGuess,
        inspected: [...state.inspected],
        priceResult: state.priceResult,
        ...summary,
      };
      const history = [...state.history, entry];
      const next = state.round + 1;
      if (next >= LISTINGS.length) {
        return { ...state, history, phase: 'result' };
      }
      return {
        ...state,
        ...freshRound(LISTINGS[next]),
        history,
        round: next,
        phase: 'listing',
      };
    }

    case 'RESET':
      return { ...initialState, ...freshRound(LISTINGS[0]) };

    default:
      return state;
  }
}
