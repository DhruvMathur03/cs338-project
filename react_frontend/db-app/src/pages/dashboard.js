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
		expense_desc.id = "expense_description_" + newId;
		expense_desc.textContent = input_desc;
		var expense_amt = document.createElement("p");
		expense_amt.textContent = input_amt;
		expense_amt.id = "expense_amount_" + newId;
		var expense_cat = document.createElement("p");
		expense_cat.textContent = input_cat;
		expense_cat.id = "expense_category_" + newId;
		var expense_date = document.createElement("p");
		expense_date.textContent = input_date;
		expense_date.id = "expense_date_" + newId;
		expense.appendChild(expense_desc);
		expense.appendChild(expense_amt);
		expense.appendChild(expense_cat);
		expense.appendChild(expense_date);

		// expense edit and delete buttons
		var expense_edit = document.createElement("button");
		expense_edit.textContent = "Edit"
		expense_edit.id = "expense_edit_" + newId;
		expense_edit.addEventListener('click', function() {
			var expense = document.getElementById("expense_"+newId);
			// remove edit and delete buttons
			var expense_edit = document.getElementById("expense_edit_"+newId);
			expense_edit.hidden = true;
			var expense_delete = document.getElementById("expense_delete_"+newId);
			expense_delete.hidden = true;

			// replace static values with editable inputs
			// expense form
			var new_expense_form = document.createElement("form");

			// expense description
			var expense_desc = document.getElementById("expense_description_"+newId);
			const expense_desc_value = expense_desc.textContent;
			expense_desc.hidden = true;
			var expense_desc_input = document.createElement("input");
			expense_desc_input.type = "text";
			expense_desc_input.value = expense_desc_value;
			expense_desc_input.required = true;
			expense_desc_input.id = "edit_expense_description_"+newId;

			// expense amount
			var expense_amt = document.getElementById("expense_amount_"+newId);
			const expense_amt_value = expense_amt.textContent;
			expense_amt.hidden = true;
			var expense_amt_input = document.createElement("input");
			expense_amt_input.type = "text";
			expense_amt_input.value = expense_amt_value;
			expense_amt_input.required = true;
			expense_amt_input.id = "edit_expense_amount_"+newId;

			// expense category
			var expense_cat = document.getElementById("expense_category_"+newId);
			const expense_cat_value = expense_cat.textContent;
			expense_cat.hidden = true;
			var expense_cat_input = document.createElement("select");
			for (let category of categories) {
				var opt = document.createElement("option");
				opt.textContent = category;
				expense_cat_input.appendChild(opt);
			}
			expense_cat_input.required = true;
			expense_cat_input.id = "edit_expense_category_"+newId;

			// expense date
			var expense_date = document.getElementById("expense_date_"+newId);
			const expense_date_value = expense_date.textContent;
			expense_date.hidden = true;
			var expense_date_input = document.createElement("input");
			expense_date_input.type = "date";
			expense_date_input.value = expense_date_value;
			expense_date_input.required = true;
			expense_date_input.id = "edit_expense_date_"+newId;

			// add new inputs to expense
			new_expense_form.appendChild(expense_desc_input);
			new_expense_form.appendChild(expense_amt_input);
			new_expense_form.appendChild(expense_cat_input);
			new_expense_form.appendChild(expense_date_input);
			expense.appendChild(new_expense_form);

			// create cancel and confirm buttons
			var cancel_edit = document.createElement("button");
			var confirm_edit = document.createElement("input");
			cancel_edit.textContent = "Cancel"
			cancel_edit.addEventListener('click', function() {
				//unhide all static elements
				expense_edit.hidden = false;
				expense_delete.hidden = false;
				expense_desc.hidden = false;
				expense_amt.hidden = false;
				expense_cat.hidden = false;
				expense_date.hidden = false;

				// remove all form elements
				expense_desc_input.remove();
				expense_amt_input.remove();
				expense_cat_input.remove();
				expense_date_input.remove();
				cancel_edit.remove();
				confirm_edit.remove();
			});
			confirm_edit.type = "submit";
			confirm_edit.addEventListener('click', function() {
				// get new values from form input
				const new_desc = expense_desc_input.value;
				const new_amt = expense_amt_input.value;
				const new_cat = expense_cat_input.value;
				const new_date = expense_date_input.value;

				//unhide all static elements
				expense_edit.hidden = false;
				expense_delete.hidden = false;
				expense_desc.hidden = false;
				expense_amt.hidden = false;
				expense_cat.hidden = false;
				expense_date.hidden = false;

				// update all static elements with new values
				expense_desc.textContent = new_desc;
				expense_amt.textContent = new_amt;
				expense_cat.textContent = new_cat;
				expense_date.textContent = new_date;

				// remove all form elements
				expense_desc_input.remove();
				expense_amt_input.remove();
				expense_cat_input.remove();
				expense_date_input.remove();
				cancel_edit.remove();
				confirm_edit.remove();
			});

			// append the cancel and confirm buttons
			expense.appendChild(cancel_edit);
			expense.appendChild(confirm_edit);
		});
		
		var expense_delete = document.createElement("button");
		expense_delete.textContent = "Delete"
		expense_delete.id = "expense_delete_" + newId;
		expense_delete.addEventListener('click', function() {
			// remove the expense from the DOM
			var expense = document.getElementById("expense_"+newId);
			expense.remove();

			// remove the expense from our DB
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
