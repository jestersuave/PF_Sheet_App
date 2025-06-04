from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt
import sqlite3

app = Flask(__name__)
CORS(app)

# This remains the default if no app.config is set (e.g. during initial app.py execution)
DATABASE_NAME = 'users.db'

def get_db_connection(db_name_override=None):
    # Priority:
    # 1. db_name_override (if function is called with a specific name, e.g., init_db('some.db'))
    # 2. app.config['DATABASE_FILE'] (set by tests for route handling)
    # 3. DATABASE_NAME (module-level default)
    if db_name_override:
        name_to_use = db_name_override
    elif 'DATABASE_FILE' in app.config:
        name_to_use = app.config['DATABASE_FILE']
    else:
        name_to_use = DATABASE_NAME

    # print(f"Connecting to database: {name_to_use}") # DEBUG - Removed
    conn = sqlite3.connect(name_to_use)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_name_override=None): # Changed param name for consistency
    # This function will use the db_name_override if provided,
    # otherwise get_db_connection will resolve based on app.config or module default.
    conn = get_db_connection(db_name_override)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Initializes the default database (users.db) when app.py is first loaded,
# as app.config['DATABASE_FILE'] is not set at this point.
init_db()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    # Basic email validation
    if "@" not in email or "." not in email.split('@')[-1]:
        return jsonify({"success": False, "message": "Invalid email format."}), 400

    # Password length check
    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters long."}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = None
    try:
        # In routes, we typically want to use the default DB, unless testing overrides.
        # For testing, the test client won't automatically use a different DB for route handlers
        # unless we modify how routes get their DB connection.
        # This refactor is primarily for init_db and direct test setup.
        # The routes will still use DATABASE_NAME via get_db_connection() called without args.
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, hashed_password))
        conn.commit()
        return jsonify({"success": True, "message": "User created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Email already exists"}), 409
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    # Basic email validation
    if "@" not in email or "." not in email.split('@')[-1]:
        return jsonify({"success": False, "message": "Invalid email format."}), 400

    # Note: No password length check on login, only on signup.

    conn = None
    try:
        conn = get_db_connection() # Same as above, routes use default DB.
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (email,))
        user_record = cursor.fetchone()

        if user_record:
            stored_password_hash = user_record[0]
            if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                return jsonify({"success": True, "message": "Login successful"}), 200
            else:
                return jsonify({"success": False, "message": "Invalid credentials"}), 401
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)
