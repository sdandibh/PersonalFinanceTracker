from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

# Sravya Dandibhatta
# Personal Finance Tracker
# PUSH GIT

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('expense.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    conn = get_db_connection()  # Create a connection using your helper function
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses;")
    expenses = cursor.fetchall()
    conn.close()  # Don't forget to close the connection
    return jsonify(expenses)

@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')

    if not description or not amount or not category or not date:
        return jsonify({"message": "Incomplete data"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)",
                       (description, amount, category, date))
        conn.commit()
        return jsonify({"message": "Expense added successfully"}), 201
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({"message": "Error adding expense"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)