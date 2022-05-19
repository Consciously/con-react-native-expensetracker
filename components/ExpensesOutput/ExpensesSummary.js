import { View, Text } from 'react-native';

const ExpensesSummary = ({ expenses, periodName }) => {
	const expensesSum = expenses.reduce((sum, expense) => {
		return sum + expense.amount;
	}, 0);

	return (
		<View>
			<Text>{periodName}</Text>
			<Text>${expensesSum}</Text>
		</View>
	);
};

export default ExpensesSummary;
