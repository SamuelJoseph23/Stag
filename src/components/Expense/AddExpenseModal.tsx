import React, { useState, useContext } from "react";
import { ExpenseContext } from "./ExpenseContext";
// Import your Expense Context and models similarly to Income
// import { ExpenseContext } from "./ExpenseContext"; 
import { 
    AnyExpense, 
    HousingExpense,
    LoanExpense,
    DependentExpense,
    HealthcareExpense,
    VacationExpense,
    EmergencyExpense,
    OtherExpense,
	EXPENSE_COLORS_BACKGROUND
} from './models';

const generateUniqueId = () =>
	`EXS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 2. Apply the interface to the component
const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {    // Step 1: 'select' | Step 2: 'details'
    const { dispatch } = useContext(ExpenseContext);
    const [step, setStep] = useState<'select' | 'details'>('select');
    const [selectedType, setSelectedType] = useState<any>(null);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [frequency, setFrequency] = useState<'Weekly' | 'BiWeekly' | 'Monthly' | 'Annually'>('Monthly');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
        
    // Reset state when closing
    const handleClose = () => {
        setStep('select');
        setSelectedType(null);
        setName("");
        onClose();
    };

    const handleTypeSelect = (typeClass: any) => {
        setSelectedType(() => typeClass);
        setStep('details');
    };

    const handleAdd = () => {
        if (!name.trim() || !selectedType) return;

        const id = generateUniqueId();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Convert the string date from the input back into a Date object
        const finalEndDate = new Date(endDate);

        const newExpense = new selectedType(
            id, 
            name.trim(), 
            amount,      // Using state value
            frequency,   // Using state value
            today,       // startDate (defaults to today)
            finalEndDate // Using state value
        );

        dispatch({ type: "ADD_EXPENSE", payload: newExpense });
        handleClose(); 
    };
    if (!isOpen) return null;

    const expenseCategories = [
    { label: 'Housing', class: HousingExpense },
    { label: 'Loan', class: LoanExpense },
    { label: 'Dependent', class: DependentExpense },
    { label: 'Healthcare', class: HealthcareExpense },
    { label: 'Vacation', class: VacationExpense },
    { label: 'Emergency', class: EmergencyExpense },
    { label: 'Other', class: OtherExpense }
];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-3">
                    {step === 'select' ? 'Select Expense Type' : `New ${selectedType.name}`}
                </h2>

                {step === 'select' ? (
                    /* STEP 1: Grid of Buttons */
                    <div className="grid grid-cols-2 gap-4">
                        {expenseCategories.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => handleTypeSelect(cat.class)}
                                className="p-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl border border-gray-700 transition-all font-medium"
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Expense Name</label>
                            <input
                                autoFocus
                                className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-3 focus:border-green-300 outline-none"
                                placeholder="e.g. Rent"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-3 focus:border-green-300 outline-none"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        {/* Frequency Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                            <select
                                className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-3 focus:border-green-300 outline-none appearance-none"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as any)}
                            >
                                <option value="Weekly">Weekly</option>
                                <option value="BiWeekly">Bi-Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Annually">Annually</option>
                            </select>
                        </div>

                        {/* End Date Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-3 focus:border-green-300 outline-none color-scheme-dark"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                    <button 
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    {step === 'details' && (
                        <button 
                            onClick={handleAdd}
                            disabled={!name.trim()}
                            className="px-5 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Expense
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;