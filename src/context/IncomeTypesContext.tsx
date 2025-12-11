import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Income } from '../types';

interface IncomeContextType {
  incomes: Income[];
  addIncome: (income: Income) => void;
  removeIncome: (id: string) => void;
  updateIncome: (updatedIncome: Income) => void;
  getTypeTotal: (type: string) => number;
  getFilteredType: (type: string) => Income[];
}
const IncomesContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeTypesProvider({ children }: { children: ReactNode }) {
  const [incomes, setIncome] = useState<Income[]>(() => {
    const saved = localStorage.getItem('user_incomes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_incomes', JSON.stringify(incomes));
  }, [incomes]);

  const addIncome = (income: Income) => {
    var temp = new Date()
    temp.setHours(0, 0, 0, 0)
    setIncome(prevIncomes => [...prevIncomes, income]);
};

const removeIncome = (id: string) => {
  setIncome(prevIncomes => prevIncomes.filter(inc => inc.id !== id));
  console.log(`Income ID: ${id} and all associated history records have been removed.`);
};

  const updateIncome = (updatedIncome: Income) => {
  setIncome(prevIncomes => 
    prevIncomes.map(income => {
      if (income.id === updatedIncome.id) {
        return updatedIncome;
      }
      return income;
    })
  );
};

  
  const getFilteredType = (type: string) =>{
    if (type === "All"){
      return incomes
    }
    return incomes.filter(inc => inc.type === type);
  }

  const getTypeTotal = (type: string) => {
    return incomes.reduce((sum, inc) => inc.type == type ? sum + inc.amount : sum, 0);
  }

  return (
    <IncomesContext.Provider value={{incomes: incomes, addIncome: addIncome, removeIncome: removeIncome, updateIncome: updateIncome, getTypeTotal, getFilteredType: getFilteredType}}>
      {children}
    </IncomesContext.Provider>
  );
}

export function useIncomes() {
  const context = useContext(IncomesContext);
  if (context === undefined) {
    throw new Error('useIncomes must be used within an IncomesProvider');
  }
  return context;
}
