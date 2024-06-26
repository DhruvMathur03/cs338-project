from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os
from flask_cors import CORS, cross_origin
import time
import sys

app = Flask(__name__, static_folder='../react_frontend/db-app/build')
CORS(app)  # Enable CORS for all routes

# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('milestone1.db')
    conn.row_factory = sqlite3.Row
    return conn

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# API endpoint to fetch all users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM user').fetchall()
    conn.close()
    users_list = [dict(user) for user in users]
    return jsonify(users_list)

# API endpoint to add a new user
@app.route('/api/users', methods=['POST'])
def add_user():
    new_user = request.get_json()
    user_id = new_user['user_id']
    name = new_user['name']

    conn = get_db_connection()
    conn.execute('INSERT INTO user (user_id, name) VALUES (?, ?)', (user_id, name))
    conn.commit()
    conn.close()
    return jsonify(new_user), 201

# API endpoint to fetch all expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    print("test")
    user_id = request.args.get('user_id')
    print(user_id)
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    expenses_list = [dict(expense) for expense in expenses]
    print(expenses_list)
    return jsonify(expenses_list)

# API endpoint to add a new expense
@app.route('/api/expenses', methods=['POST'])
def add_expense():
    new_expense = request.get_json()
    # expense_id = new_expense['expense_id']
    expense_id = f"expense_{int(time.time())}"
    amount = new_expense['amount']
    category = new_expense['category']
    date = new_expense['date']
    user_id = new_expense['user_id']
    description = new_expense['description']

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO expenses (expense_id, amount, category, date, user_id, description) VALUES (?, ?, ?, ?, ?, ?)',
        (expense_id, amount, category, date, user_id, description)
    )
    conn.commit()
    conn.close()
    return jsonify(new_expense), 201

# API endpoint to delete an expense
@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE expense_id = ?', (expense_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'expense_id': expense_id})

# API endpoint to update an expense
@app.route('/api/expenses/<expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = request.get_json()
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE expense_id = ?', 
                   (description, amount, category, date, expense_id))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'expense_id': expense_id})

# API endpoint for user authentication
@app.route('/api/auth', methods=['POST'])
def authenticate_user():
    login_data = request.get_json()
    email = login_data['email']
    password = login_data['password']

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM individual WHERE email = ? AND password = ?', (email, password)).fetchone()
    conn.close()

    if user:
        user_dict = dict(user)
        return jsonify({"status": "success", "user": user_dict}), 200
    else:
        return jsonify({"status": "fail", "message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)