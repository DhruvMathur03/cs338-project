import React, { useState } from 'react';
import './dashboard.css';

function Dashboard() {
	// pull expense categories from db
	// categories = get_categories(userID)
	const categories = ["Rent", "Groceries", "Clothes", "Other"];

	// render category dropdown
	var categoryOptions = [];
	for (let category of categories) {
		categoryOptions.push(<option>{category}</option>);
	};
	
    const addExpense = (event) => {
		// adds an expense to the expense list
		event.preventDefault();
		var expense_list = document.getElementById("expenseList");

		// extract values from form
		const input_desc = document.getElementById("expenseFormDescription").value;
		const input_amt = document.getElementById("expenseFormAmount").value;
		const input_cat = document.getElementById("expenseFormCategory").value;
		const input_date = document.getElementById("expenseFormDate").value;

		// clear the form
		var expenseForm = document.getElementById("expenseForm");
		for (let child of expenseForm.children) {
			if (child.children.length > 0) {
				// clear this attribute
				child.children[0].value = "";
			}
		}

		// create a new expense object
		// expense data
		var expenses = expense_list.children;
		var newId = 0;
		if (expenses.length > 0) {
			newId = parseInt(expenses[expenses.length - 1].id.split("_")[1]) + 1;
		}
		var expense = document.createElement("div");
		expense.style.backgroundColor = "blue";
		expense.id = "expense_" + newId;
		var expense_desc = document.createElement("p");
		expense_desc.textContent = input_desc;
		var expense_amt = document.createElement("p");
		expense_amt.textContent = input_amt;
		var expense_cat = document.createElement("p");
		expense_cat.textContent = input_cat;
		var expense_date = document.createElement("p");
		expense_date.textContent = input_date;
		expense.appendChild(expense_desc);
		expense.appendChild(expense_amt);
		expense.appendChild(expense_cat);
		expense.appendChild(expense_date);

		// expense edit and delete buttons
		var expense_edit = document.createElement("button");
		expense_edit.textContent = "Edit"
		expense_edit.addEventListener('click', function(e) {
			console.log("EDIT",  document.getElementById("expense_"+newId));
		});
		
		var expense_delete = document.createElement("button");
		expense_delete.textContent = "Delete"
		expense_delete.addEventListener('click', function(e) {
			var expense = document.getElementById("expense_"+newId);
			expense.remove();
		});
		expense.appendChild(expense_edit);
		expense.appendChild(expense_delete);
		
		// add the new expense to the expense list
		expense_list.appendChild(expense);

		// add the new expense to our DB
	}


    return (
	<div className="Dashboard">
	    <header className="header">
			<h1>Expense Management</h1>
	    </header>
		
		<form id="expenseForm" onSubmit={addExpense}>
			<h2>Add an Expense</h2>
			<label>Description: 
				<input 
					type="text"
					name="description"
					id="expenseFormDescription"
					required
				/>
			</label>

			<label>Amount $
				<input 
					type="text"
					name="amount"
					id="expenseFormAmount"
					required
				/>
			</label>

			<label>Category: 
				<select 
					name="category"
					id="expenseFormCategory"
					required
				>
					{categoryOptions}
				</select>
			</label>

			<label>Date: 
				<input
					type="date"
					name="date"
					id="expenseFormDate"
					required>
				</input>
			</label>

			<input type="submit" />
		</form>

	    <div id="expenseList">
	    </div>
	</div>
    );
}

export default Dashboard;
