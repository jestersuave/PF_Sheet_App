from flask import Flask, jsonify, request, session, redirect
from flask_cors import CORS
import bcrypt
import sqlite3
import os
import google.oauth2.credentials
import google_auth_oauthlib.flow
import requests # Already here but good to note

app = Flask(__name__)
CORS(app, supports_credentials=True) # Added supports_credentials for session cookies
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://127.0.0.1:5000/login/google/callback"
OAUTH_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

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
            password_hash TEXT,
            google_id TEXT UNIQUE,
            name TEXT
        )
    ''')
# Clear the table for schema change (development only)
    # cursor.execute("DELETE FROM users")
    # print("INFO: Users table cleared for schema update.") # DEBUG
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
        conn = get_db_connection()
        cursor = conn.cursor()
        # Check for users with password_hash first
        cursor.execute("SELECT password_hash FROM users WHERE email = ? AND password_hash IS NOT NULL", (email,))
        user_record = cursor.fetchone()

        if user_record:
            stored_password_hash = user_record[0] # Now user_record[0] is password_hash
            if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                session['user_email'] = email # Set session
                return jsonify({"success": True, "message": "Login successful"}), 200
            else:
                return jsonify({"success": False, "message": "Invalid credentials"}), 401
        else:
            # If no user found with password_hash, or email doesn't exist for password login
            return jsonify({"success": False, "message": "Invalid credentials or user may use Google Sign-In"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/login/google')
def login_google():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({"success": False, "message": "Google OAuth not configured"}), 500

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file=None,  # Using client_id & client_secret directly
        scopes=OAUTH_SCOPES,
        redirect_uri=REDIRECT_URI
    )
    # For direct instantiation if client_secrets.json is not used
    flow.client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        }
    }

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    session['oauth_state'] = state # Store state to prevent CSRF
    return redirect(authorization_url)

@app.route('/login/google/callback')
def login_google_callback():
    state = session.pop('oauth_state', '')
    if not state or state != request.args.get('state'):
        return jsonify({"success": False, "message": "Invalid state or CSRF detected"}), 400

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({"success": False, "message": "Google OAuth not configured"}), 500

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file=None, # Using client_id & client_secret directly
        scopes=OAUTH_SCOPES,
        redirect_uri=REDIRECT_URI
    )
    flow.client_config = { # Re-config flow for token exchange
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }

    try:
        flow.fetch_token(authorization_response=request.url)
    except Exception as e: # Broad exception for token fetch errors
        print(f"Error fetching token: {e}") # Log error
        return jsonify({"success": False, "message": f"Failed to fetch OAuth token: {str(e)}"}), 500

    credentials = flow.credentials

    # Get user info
    userinfo_response = requests.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        headers={'Authorization': f'Bearer {credentials.token}'}
    )

    if not userinfo_response.ok:
        return jsonify({"success": False, "message": "Failed to fetch user info from Google"}), 500

    user_info = userinfo_response.json()
    email = user_info.get('email')
    name = user_info.get('name')
    google_id = user_info.get('sub') # 'sub' is the standard field for unique user ID

    if not email:
        return jsonify({"success": False, "message": "Email not provided by Google"}), 400

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT email, name, google_id FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if user:
            # User exists, log them in and potentially update google_id or name if changed
            if not user['google_id']: # If existing user logs in with Google first time
                 cursor.execute("UPDATE users SET google_id = ?, name = ? WHERE email = ?", (google_id, name, email))
            elif user['google_id'] != google_id: # Should not happen if email is verified
                 return jsonify({"success": False, "message": "Google ID mismatch."}), 400
            # Update name if it was missing or changed
            if user['name'] != name:
                 cursor.execute("UPDATE users SET name = ? WHERE email = ?", (name, email))
            conn.commit()
        else:
            # New user, create them
            cursor.execute("INSERT INTO users (email, name, google_id) VALUES (?, ?, ?)", (email, name, google_id))
            conn.commit()

        session['user_email'] = email
        session['user_name'] = name # Store name in session as well
        # Redirect to a frontend page that indicates successful login
        # For now, just a JSON response
        # In a real app, you'd redirect to something like '/profile' or '/'
        return jsonify({"success": True, "message": "Login successful via Google", "email": email, "name": name})

    except sqlite3.Error as e:
        print(f"Database error: {e}") # Log DB error
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
    except Exception as e:
        print(f"General error: {e}") # Log any other error
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/logout', methods=['POST']) # Basic logout
def logout():
    session.pop('user_email', None)
    session.pop('user_name', None)
    session.pop('oauth_state', None) # Clean up oauth state too
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route('/@me') # Example protected route
def get_current_user():
    if 'user_email' in session:
        return jsonify({
            "logged_in": True,
            "email": session['user_email'],
            "name": session.get('user_name')
        }), 200
    return jsonify({"logged_in": False}), 401


if __name__ == '__main__':
    # IMPORTANT: For development with http, Flask-OAuthlib needs this:
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run(debug=True, port=5000)
