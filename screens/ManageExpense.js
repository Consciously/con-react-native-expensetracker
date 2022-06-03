import { useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../contstants/styles';
import { ExpensesContext } from '../store/expense-context';
import { storeExpense, updateExpense, deleteExpense } from '../util/http';

const ManageExpense = ({ route, navigation }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState();
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

	const deleteExpenseHandler = async () => {
		setIsSubmitting(true);

		expensesCtx.deleteExpense(editedExpenseId);
		navigation.goBack();
		try {
			await deleteExpense(editedExpenseId);
		} catch (error) {
			setError('Could not delete expense - please try again later!');
			setIsSubmitting(false);
		}
	};
	const cancelHandler = () => {
		navigation.goBack();
	};
	const confirmHandler = async expenseData => {
		setIsSubmitting(true);

		try {
			if (isEditing) {
				expensesCtx.updateExpense(editedExpenseId, expenseData);
				await updateExpense(editedExpenseId, expenseData);
			} else {
				const id = await storeExpense(expenseData);
				expensesCtx.addExpense({ ...expenseData, id });
			}
			navigation.goBack();
		} catch (error) {
			setError('Could not save data - please try again later!');
			setIsSubmitting(false);
		}
	};

	const errorHandler = () => {
		setError(null);
	};

	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} onConfirm={setError} />;
	}

	if (isSubmitting) {
		return <LoadingOverlay />;
	}

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
