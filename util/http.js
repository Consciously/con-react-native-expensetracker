import axios from 'axios';

export const storeExpense = expenseData => {
	axios.post(
		'https://react-navtive-expenseapp-default-rtdb.firebaseio.com/expenses.json',
		expenseData
	);
};
