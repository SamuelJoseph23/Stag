import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { 
    AnyIncome, 
    CLASS_TO_CATEGORY,
    IncomeCategory,
    INCOME_CATEGORIES
} from "./models";

// Define a clean color mapping for income categories
const CATEGORY_COLORS: Record<IncomeCategory, string> = {
    Work: "#d946ef",           // Fuchsia
    SocialSecurity: "#3b82f6", // Blue
    Passive: "#eab308",        // Yellow
    Windfall: "#ef4444",       // Red
};

type IncomeHorizontalBarChartProps = {
    type: string;
    incomeList: AnyIncome[];
};

const getMonthlyAmount = (income: AnyIncome) => {
    switch (income.frequency) {
        case 'Weekly': return income.amount * 52 / 12;
        case 'Monthly': return income.amount;
        case 'Annually': return income.amount / 12;
        default: return 0;
    }
};

export default function IncomeHorizontalBarChart({
    type,
    incomeList,
}: IncomeHorizontalBarChartProps) {

    const { nivoData, nivoKeys, totalMonthlyIncome, incomeMeta } = useMemo(() => {
        // Sort the list by category so segments of the same color are grouped together
        const sortedList = [...incomeList].sort((a, b) => {
            const catA = CLASS_TO_CATEGORY[a.constructor.name] || 'Other';
            const catB = CLASS_TO_CATEGORY[b.constructor.name] || 'Other';
            return INCOME_CATEGORIES.indexOf(catA as any) - INCOME_CATEGORIES.indexOf(catB as any);
        });

        const meta: Record<string, any> = {};
        const dataObj: Record<string, any> = { id: 'Monthly Income' };
        const keys: string[] = [];
        let total = 0;

        sortedList.forEach(income => {
            const monthly = getMonthlyAmount(income);
            const category = CLASS_TO_CATEGORY[income.constructor.name];

            dataObj[income.id] = monthly;
            keys.push(income.id);
            total += monthly;

            // Store metadata for the rich tooltip display
            meta[income.id] = {
                category,
                name: income.name,
                originalAmount: income.amount,
                frequency: income.frequency,
                monthlyAmount: monthly
            };
        });

        return { 
            nivoData: [dataObj], 
            nivoKeys: keys, 
            totalMonthlyIncome: total,
            incomeMeta: meta
        };
    }, [incomeList]);

    if (incomeList.length === 0) return null;

    return (
        <div className="mb-4">
            {/* Z-INDEX FIX: Header given lower z-index so tooltips appear on top */}
            <div className="relative z-0 flex justify-center text-white text-md font-bold mb-2">
                {type} (Monthly) $
                {totalMonthlyIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </div>
            
            {/* CHART SECTION: relative z-10 ensures tooltips are not obscured */}
            <div className="relative z-10 w-full h-8 bg-gray-900 border border-gray-800 rounded-md">
                <ResponsiveBar
                    data={nivoData}
                    keys={nivoKeys}
                    indexBy="id"
                    layout="horizontal"
                    // FIX: Use valueScale with max set to total to fill the width
                    valueScale={{ type: 'linear', max: totalMonthlyIncome }}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    padding={0}
                    indexScale={{ type: 'band', round: true }}
                    // Map bars to their specific category colors
                    colors={(bar) => CATEGORY_COLORS[incomeMeta[bar.id].category as IncomeCategory]}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
                    borderWidth={1}
                    enableGridX={false}
                    enableGridY={false}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    label={""}
                    isInteractive={true}
                    tooltip={({ id, color }) => {
                        const m = incomeMeta[id];
                        return (
                            <div className="bg-gray-950 border border-gray-700 p-2 rounded shadow-2xl text-[11px] text-white">
                                <div className="flex items-center gap-2 mb-1 border-b border-gray-800 pb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                    <span className="font-bold uppercase tracking-tight">{m.category}: {m.name}</span>
                                </div>
                                <div className="flex justify-between gap-6">
                                    <span className="text-gray-400">Original:</span>
                                    {/* Rounding to 2 decimal places */}
                                    <span>${m.originalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({m.frequency})</span>
                                </div>
                                <div className="flex justify-between gap-6">
                                    <span className="text-gray-400">Monthly Est:</span>
                                    <span className="text-green-400 font-mono font-bold">
                                        {/* Rounding to 2 decimal places */}
                                        +${m.monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        );
                    }}
                    theme={{
                        tooltip: {
                            container: {
                                background: 'transparent',
                                padding: 0,
                                boxShadow: 'none'
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}