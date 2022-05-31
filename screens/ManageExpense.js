import { useContext, useLayoutEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Button from '../components/UI/Button';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../contstants/styles';
import { ExpensesContext } from '../store/expense-context';

const ManageExpense = ({ route, navigation }) => {
	const editedExpenseId = route.params?.expenseId;
	const isEditing = !!editedExpenseId;

	const expensesCtx = useContext(ExpensesContext);

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
	const confirmHandler = () => {
		if (isEditing) {
			expensesCtx.updateExpense(editedExpenseId, {
				description: 'Test!!!!!!!',
				amount: 29.99,
				date: new Date('2022-05-23')
			});
		} else {
			expensesCtx.addExpense({
				description: 'Test',
				amount: 19.99,
				date: new Date('2022-05-22')
			});
		}
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<TextInput />
			<View style={styles.buttons}>
				<Button style={styles.button} mode='flat' onPress={cancelHandler}>
					Cancel
				</Button>
				<Button style={styles.button} onPress={confirmHandler}>
					{isEditing ? 'Update' : 'Add'}
				</Button>
			</View>
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
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center'
	}
});
