import { createContext, useReducer, ReactNode, useEffect, Dispatch } from 'react';

export interface AssumptionsState {
  macro: {
    inflationRate: number;       // e.g., 3.0
    healthcareInflation: number; // e.g., 5.0
    educationInflation: number;  // e.g., 6.0
    taxBracketGrowth: boolean;   // usually true (pegged to inflation)
  };
  income: {
    salaryGrowth: number;        // e.g., 3.0
    bonusRate: number;           // e.g., 10.0 (% of salary)
    socialSecurityStartAge: number;
  };
  expenses: {
    lifestyleCreep: number;      // e.g., 50.0 (% of raise spent)
    housingAppreciation: number; // e.g., 3.5
    rentInflation: number;       // e.g., 4.0
  };
  investments: {
    returnRates: {
      bull: number;   // e.g., 10.0
      base: number;   // e.g., 7.0
      bear: number;   // e.g., 2.0
    };
    fees: number;     // e.g., 0.15 (expense ratios)
    withdrawalStrategy: 'FixedReal' | 'Percentage' | 'GuytonKlinger';
    withdrawalRate: number; // e.g., 4.0
  };
  demographics: {
    retirementAge: number;
    lifeExpectancy: number;
  };
}

export const defaultAssumptions: AssumptionsState = {
  macro: {
    inflationRate: 3.0,
    healthcareInflation: 5.0,
    educationInflation: 6.0,
    taxBracketGrowth: true,
  },
  income: {
    salaryGrowth: 3.0,
    bonusRate: 0,
    socialSecurityStartAge: 67,
  },
  expenses: {
    lifestyleCreep: 20.0,
    housingAppreciation: 3.0,
    rentInflation: 3.5,
  },
  investments: {
    returnRates: { bull: 10, base: 7, bear: 4 },
    fees: 0.1,
    withdrawalStrategy: 'FixedReal',
    withdrawalRate: 4.0,
  },
  demographics: {
    retirementAge: 65,
    lifeExpectancy: 90,
  },
};

type Action =
  | { type: 'UPDATE_MACRO'; payload: Partial<AssumptionsState['macro']> }
  | { type: 'UPDATE_INCOME'; payload: Partial<AssumptionsState['income']> }
  | { type: 'UPDATE_EXPENSES'; payload: Partial<AssumptionsState['expenses']> }
  | { type: 'UPDATE_INVESTMENTS'; payload: Partial<AssumptionsState['investments']> }
  | { type: 'UPDATE_INVESTMENT_RATES'; payload: Partial<AssumptionsState['investments']['returnRates']> }
  | { type: 'UPDATE_DEMOGRAPHICS'; payload: Partial<AssumptionsState['demographics']> }
  | { type: 'RESET_DEFAULTS' }
  | { type: 'SET_BULK_DATA'; payload: AssumptionsState };

const assumptionsReducer = (state: AssumptionsState, action: Action): AssumptionsState => {
  switch (action.type) {
    case 'UPDATE_MACRO':
      return { ...state, macro: { ...state.macro, ...action.payload } };
    case 'UPDATE_INCOME':
      return { ...state, income: { ...state.income, ...action.payload } };
    case 'UPDATE_EXPENSES':
      return { ...state, expenses: { ...state.expenses, ...action.payload } };
    case 'UPDATE_INVESTMENTS':
      return { ...state, investments: { ...state.investments, ...action.payload } };
    case 'UPDATE_INVESTMENT_RATES':
      return {
        ...state,
        investments: {
          ...state.investments,
          returnRates: { ...state.investments.returnRates, ...action.payload },
        },
      };
    case 'UPDATE_DEMOGRAPHICS':
      return { ...state, demographics: { ...state.demographics, ...action.payload } };
    case 'RESET_DEFAULTS':
      return defaultAssumptions;
    case 'SET_BULK_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const AssumptionsContext = createContext<{ state: AssumptionsState; dispatch: Dispatch<Action> } | undefined>(undefined);

export const AssumptionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(assumptionsReducer, defaultAssumptions, (initial) => {
    const saved = localStorage.getItem('assumptions_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge parsed data with initial to ensure structure integrity
        return { ...initial, ...parsed };
      } catch (e) {
        console.error("Failed to parse assumptions settings", e);
      }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('assumptions_settings', JSON.stringify(state));
  }, [state]);

  return <AssumptionsContext.Provider value={{ state, dispatch }}>{children}</AssumptionsContext.Provider>;
};
