import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../../components/Expense/ExpenseContext';
import { 
  DefaultExpense,
  SecondaryExpense,
  BaseExpense,
  EXPENSE_CATEGORIES
} from '../../components/Expense/models';
import ExpenseCard from '../../components/Expense/ExpenseCard';
import ExpenseHorizontalBarChart from '../../components/Expense/ExpenseHorizontalBarChart';
import AddExpenseControl from '../../components/Expense/AddExpenseUI';
import AddExpenseModal from '../../components/Expense/AddExpenseModal';

const ExpenseList = ({ type }: { type: any }) => {
  const { expenses } = useContext(ExpenseContext);
  const filteredExpenses = expenses.filter((exp) =>exp instanceof type);

  if (filteredExpenses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {filteredExpenses.map((expense) => (
        <ExpenseCard key={`${expense.id}-${expense.constructor.name}`} expense={expense} />
      ))}
    </div>
  );
};

const TabsContent = () => {
    const { expenses } = useContext(ExpenseContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const allExpenses = expenses; 
    const defaultExpense = expenses.filter(exp => exp instanceof DefaultExpense);
    const secondaryExpense = expenses.filter(exp => exp instanceof SecondaryExpense);

    const isDefaultVisible = defaultExpense.length > 0 && (secondaryExpense.length > 0);
    const isSecondaryVisible = secondaryExpense.length > 0&& (defaultExpense.length > 0);

    const visibleChartCount = [
        isDefaultVisible,
        isSecondaryVisible
    ].filter(Boolean).length;
    
    const gridClass = visibleChartCount > 1 ? 'grid-cols-2' : 'grid-cols-1';

    return (
        <div className="w-full min-h-full flex bg-gray-950 justify-center pt-6">
            <div className="w-15/16 max-w-5xl">
                <div className="space-y-4 mb-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Expense Breakdown (Monthly Normalized)</h2>
                    {allExpenses.length > 0 && (
                        <ExpenseHorizontalBarChart 
                            type="Total Monthly Expenses" 
                            expenseList={allExpenses}
                        />
                    )}
                    {visibleChartCount > 0 && (
                        <div className={`grid ${gridClass} gap-4 pt-2`}>
                            {isDefaultVisible && (
                                <ExpenseHorizontalBarChart 
                                    type="DefaultExpense" 
                                    expenseList={defaultExpense}
                                />
                            )}
                            {isSecondaryVisible && (
                                <ExpenseHorizontalBarChart 
                                    type="SecondaryExpense" 
                                    expenseList={secondaryExpense}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <ExpenseList type={BaseExpense} />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 p-4 rounded-xl text-white font-bold"
                    >
                        + Add Expense
                    </button>

                    <AddExpenseModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </div>

            </div>
        </div>
    );
}

export default function ExpenseTab() {
  return (
    <TabsContent />
  );
}