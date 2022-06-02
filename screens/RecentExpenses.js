import { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expense-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/http';

const RecentExpenses = () => {
	const [isFetching, setIsFetching] = useState(true);
	const expensesCtx = useContext(ExpensesContext);

	useEffect(() => {
		const getExpenses = async () => {
			setIsFetching(true);
			const expenses = await fetchExpenses();
			setIsFetching(false);
			expensesCtx.setExpenses(expenses);
		};

		getExpenses();
	}, []);

	if (isFetching) {
		return <LoadingOverlay />;
	}

	const recentExpenses = expensesCtx.expenses.filter(expense => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);

		return expense.date >= date7DaysAgo && expense.date <= today;
	});

	return (
		<ExpensesOutput
			expenses={recentExpenses}
			expensesPeriod='Last 7 Days'
			fallbackText='No expenses registered for the last 7 days found!'
		/>
	);
};

export default RecentExpenses;
