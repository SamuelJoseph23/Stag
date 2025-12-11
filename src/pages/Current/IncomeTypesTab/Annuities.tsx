import { useIncomes } from "../../../context/IncomeTypesContext";
import IncomeList from "../../../components/IncomeList";
import AddIncome from "../../../components/AddIncome";
import {INCOME_TYPES} from '../../../types';

export default function Annuities() {
  const { incomes } = useIncomes();

  return (
    <div className="flex flex-col rounded-b-lg">
      <IncomeList
        filteredIncomes={incomes.filter((income) => {
          return income.type === "Annuities";
        })}
      />
      <AddIncome type={INCOME_TYPES[0]} />
    </div>
  );
}
