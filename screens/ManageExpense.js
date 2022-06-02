import { useContext, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../contstants/styles';
import { ExpensesContext } from '../store/expense-context';
import { storeExpense } from '../util/http';

const ManageExpense = ({ route, navigation }) => {
	const editedExpenseId = route.params?.expenseId;
	const expensesCtx = useContext(ExpensesContext);
	const isEditing = !!editedExpenseId;

	const selectedExpense = expensesCtx.expenses.find(
		expense => expense.id === editedExpenseId
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Expense' : 'Add Expense'
		});
	}, [navigation, isEditing]);

	const deleteExpenseHandler = () => {
		expensesCtx.deleteExpense(editedExpenseId);
		navigation.goBack();
	};
	const cancelHandler = () => {
		navigation.goBack();
	};
	const confirmHandler = expenseData => {
		if (isEditing) {
			expensesCtx.updateExpense(editedExpenseId, expenseData);
		} else {
			storeExpense(expenseData);
			expensesCtx.addExpense(expenseData);
		}
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<ExpenseForm
				submitButtonLabel={isEditing ? 'Update' : 'Add'}
				onSubmit={confirmHandler}
				onCancel={cancelHandler}
				defaultValues={selectedExpense}
			/>

			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon='trash'
						size={36}
						color={GlobalStyles.colors.error500}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
};

export default ManageExpense;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center'
	}
});
