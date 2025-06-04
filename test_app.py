import unittest
import json
import unittest
import json
import os
import sqlite3
import bcrypt
# Import app, init_db function
from app import app, init_db
# We don't need ORIGINAL_APP_DB_NAME if we are using app.config and popping the key

TEST_DB_NAME = 'test_users.db'

class AuthTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        app.config['TESTING'] = True
        # Configure the app to use the test database for route handlers
        app.config['DATABASE_FILE'] = TEST_DB_NAME

        # Initialize the test database schema once.
        # init_db called with TEST_DB_NAME will use it directly.
        init_db(TEST_DB_NAME)

    @classmethod
    def tearDownClass(cls):
        # Clean up the test database file
        if os.path.exists(TEST_DB_NAME):
            os.remove(TEST_DB_NAME)
        # Remove the test-specific config from the app
        app.config.pop('DATABASE_FILE', None)

    def setUp(self):
        # This runs before each test
        self.client = app.test_client()
        # print(f"setUp: app.config['DATABASE_FILE'] is {app.config.get('DATABASE_FILE')}") # DEBUG
        # print(f"setUp: Connecting to TEST_DB_NAME: {TEST_DB_NAME} for cleanup/init") # DEBUG

        # Aggressive cleaning: remove and re-initialize DB for each test
        # This ensures no state leakage between tests.
        if os.path.exists(TEST_DB_NAME):
            os.remove(TEST_DB_NAME)
        init_db(TEST_DB_NAME) # Create DB and table fresh
        # print(f"setUp: Initialized DB {TEST_DB_NAME}") # DEBUG

    def tearDown(self):
        # No specific per-test cleanup needed
        pass

    # Helper to create a user directly in the test database
    def _create_user(self, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        conn = sqlite3.connect(TEST_DB_NAME) # Use TEST_DB_NAME
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, hashed_password))
            conn.commit()
        except sqlite3.IntegrityError:
            conn.rollback()
            # This helper is usually called after ensuring the DB is clean or for specific duplicate tests
            # So, an IntegrityError here might indicate a test logic issue.
            print(f"Warning: IntegrityError in _create_user for {email}")
            raise
        finally:
            conn.close()

    # --- Signup Test Cases ---
    def test_signup_success(self):
        # print(f"test_signup_success: app.config['DATABASE_FILE'] is {app.config.get('DATABASE_FILE')} before POST") # DEBUG
        response = self.client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'password123'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 201) # Assuming 201 for created
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'User created successfully')

        # Verify in DB
        conn = sqlite3.connect(TEST_DB_NAME) # Use TEST_DB_NAME
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM users WHERE email = ?", ('test@example.com',))
        user = cursor.fetchone()
        conn.close()
        self.assertIsNotNone(user)

    def test_signup_duplicate_email(self):
        self.client.post('/signup', json={'email': 'test@example.com', 'password': 'password123'}) # First user
        response = self.client.post('/signup', json={ # Second user with same email
            'email': 'test@example.com',
            'password': 'anotherpassword'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 409)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Email already exists')

    def test_signup_invalid_email(self):
        response = self.client.post('/signup', json={
            'email': 'testexample.com', # Invalid email
            'password': 'password123'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Invalid email format.')

    def test_signup_missing_fields(self):
        response_missing_email = self.client.post('/signup', json={'password': 'password123'})
        data_missing_email = json.loads(response_missing_email.data)
        self.assertEqual(response_missing_email.status_code, 400)
        self.assertFalse(data_missing_email['success'])
        self.assertEqual(data_missing_email['message'], 'Email and password are required')

        response_missing_password = self.client.post('/signup', json={'email': 'test@example.com'})
        data_missing_password = json.loads(response_missing_password.data)
        self.assertEqual(response_missing_password.status_code, 400)
        self.assertFalse(data_missing_password['success'])
        self.assertEqual(data_missing_password['message'], 'Email and password are required')

    def test_signup_password_too_short(self):
        response = self.client.post('/signup', json={
            'email': 'test@example.com',
            'password': '123' # Too short
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Password must be at least 6 characters long.')

    # --- Login Test Cases ---
    def test_login_success(self):
        self._create_user('login_test@example.com', 'password123')

        response = self.client.post('/login', json={
            'email': 'login_test@example.com',
            'password': 'password123'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Login successful')

    def test_login_wrong_password(self):
        self._create_user('login_test@example.com', 'password123')

        response = self.client.post('/login', json={
            'email': 'login_test@example.com',
            'password': 'wrongpassword'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Invalid credentials')

    def test_login_user_not_found(self):
        response = self.client.post('/login', json={
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Invalid credentials')

    def test_login_invalid_email_format(self):
        response = self.client.post('/login', json={
            'email': 'testlogin.com', # Invalid
            'password': 'password123'
        })
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Invalid email format.')

    def test_login_missing_fields(self):
        response_missing_email = self.client.post('/login', json={'password': 'password123'})
        data_missing_email = json.loads(response_missing_email.data)
        self.assertEqual(response_missing_email.status_code, 400)
        self.assertFalse(data_missing_email['success'])
        self.assertEqual(data_missing_email['message'], 'Email and password are required')

        response_missing_password = self.client.post('/login', json={'email': 'test@example.com'})
        data_missing_password = json.loads(response_missing_password.data)
        self.assertEqual(response_missing_password.status_code, 400)
        self.assertFalse(data_missing_password['success'])
        self.assertEqual(data_missing_password['message'], 'Email and password are required')

if __name__ == '__main__':
    unittest.main()
