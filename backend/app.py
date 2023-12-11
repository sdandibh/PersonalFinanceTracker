from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('expense.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    conn = get_db_connection()  
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses;")
    expenses = cursor.fetchall()
    conn.close()  
    expenses_list = [dict(expense) for expense in expenses]  # Convert to a list of dictionaries
    return jsonify({"expenses": expenses_list})

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

@app.route('/delete_expense/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
        conn.commit()
        return jsonify({"message": "Expense deleted successfully"}), 200
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({"message": "Error deleting expense"}), 500
    finally:
        conn.close()

@app.route('/edit_expense/<int:expense_id>', methods=['PUT'])
def edit_expense(expense_id):
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
        cursor.execute("UPDATE expenses SET description=?, amount=?, category=?, date=? WHERE id=?",
                       (description, amount, category, date, expense_id))
        conn.commit()
        return jsonify({"message": "Expense updated successfully"}), 200
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({"message": "Error updating expense"}), 500
    finally:
        conn.close()

@app.route('/generate_report', methods=['GET'])
def generate_report():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT SUM(amount) as total_amount FROM expenses;")
        result = cursor.fetchone()
        total_amount = result['total_amount'] if result['total_amount'] is not None else 0
        return jsonify({"total_amount": total_amount})
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({"message": "Error generating report"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
