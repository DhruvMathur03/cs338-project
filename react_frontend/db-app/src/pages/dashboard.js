import React, { useState } from 'react';
import './dashboard.css';

function Dashboard() {
    
	const [inputs, setInputs] = useState({})

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}
	
    const addExpense = (event) => {
		// adds an expense to the expense list
		event.preventDefault();

		// extract values from form
		const input_desc = inputs["description"];
		const input_amt = inputs["amount"];
		const input_cat = inputs["category"];

		// create a new expense object
		var expense = document.createElement("div");
		expense.style.backgroundColor = "blue";
		var expense_desc = document.createElement("p");
		expense_desc.textContent = input_desc;
		var expense_amt = document.createElement("p");
		expense_amt.textContent = input_amt;
		var expense_cat = document.createElement("p");
		expense_cat.textContent = input_cat;
		expense.appendChild(expense_desc);
		expense.appendChild(expense_amt);
		expense.appendChild(expense_cat);
		
		// find the div containing the expense list
		var expense_list = document.getElementById("expenseList");
		expense_list.appendChild(expense);
	}


    return (
	<div className="Dashboard">
	    <header className="header">
			<h1>Expense Management</h1>
	    </header>
		
		<form onSubmit={addExpense}>
			<h2>Add an Expense</h2>
			<label>Description: 
				<input 
					type="text"
					name="description"
					value={inputs.description || ""}
					onChange={handleChange}
				/>
			</label>

			<label>Amount $
				<input 
					type="text"
					name="amount"
					value={inputs.amount || ""}
					onChange={handleChange}
				/>
			</label>

			<label>Category: 
				<select name="category" value={inputs.category || ""} onChange={handleChange}>
					<option>Rent</option>
					<option>Groceries</option>
					<option>Clothes</option>
					<option>Other</option>
				</select>
			</label>

			<input type="submit" />
		</form>

	    <div id="expenseList">
	    </div>
	</div>
    );
}

export default Dashboard;
