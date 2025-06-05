import unittest
import json
import unittest
import json
import os
import sqlite3
import bcrypt
from unittest.mock import patch, Mock # Added
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

        # Set mock Google OAuth environment variables
        os.environ['GOOGLE_CLIENT_ID'] = 'test_google_client_id'
        os.environ['GOOGLE_CLIENT_SECRET'] = 'test_google_client_secret'
        # app.py reads these at import time, so they need to be set before app is fully used by tests.
        # We might need to re-import or reload app if it has already cached these values,
        # but Flask apps usually read os.environ on demand or during init.
        # For app.py current structure, this should be fine as GOOGLE_CLIENT_ID etc are top-level.

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

    # --- Helper to get user from DB ---
    def _get_user_by_email(self, email):
        conn = sqlite3.connect(TEST_DB_NAME)
        conn.row_factory = sqlite3.Row # To access columns by name
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()
        return user

    # --- Google OAuth Test Cases ---

    @patch('app.google_auth_oauthlib.flow.Flow')
    def test_google_login_redirect(self, MockFlow):
        # Configure the mock Flow instance
        mock_flow_instance = MockFlow.from_client_secrets_file.return_value
        mock_flow_instance.authorization_url.return_value = ('https://mock_auth_url.com', 'mock_state')

        response = self.client.get('/login/google')

        self.assertEqual(response.status_code, 302) # Should redirect
        self.assertTrue(response.location.startswith('https://mock_auth_url.com'))
        with self.client.session_transaction() as sess:
            self.assertEqual(sess['oauth_state'], 'mock_state')

        # Check that Flow.from_client_secrets_file was called correctly (indirectly via flow.client_config)
        # This is a bit tricky because we are not using client_secrets_file directly in app.py
        # Instead, we check that client_config was set up as expected.
        # For now, checking the redirect and session state is the primary concern.


    @patch('app.requests.get') # To mock fetching user info from Google
    @patch('app.google_auth_oauthlib.flow.Flow') # To mock the OAuth flow
    def test_google_callback_new_user(self, MockFlow, mock_requests_get):
        # 1. Setup Mocks for OAuth flow
        mock_flow_instance = MockFlow.from_client_secrets_file.return_value
        # mock_flow_instance.fetch_token.return_value = None # fetch_token modifies the instance

        # Mock credentials object that flow.credentials would return
        mock_credentials = Mock()
        mock_credentials.token = 'mock_google_token'
        mock_flow_instance.credentials = mock_credentials

        # 2. Mock the response from Google's userinfo endpoint
        mock_user_info = {
            'sub': 'google_user_123',
            'email': 'newuser@example.com',
            'name': 'New Google User',
            'email_verified': True # Assuming verified email
        }
        mock_response_get = Mock()
        mock_response_get.ok = True
        mock_response_get.json.return_value = mock_user_info
        mock_requests_get.return_value = mock_response_get

        # 3. Simulate the user coming back from Google with state and code
        with self.client.session_transaction() as sess:
            sess['oauth_state'] = 'test_state_value'

        # The URL would typically include 'code=' from Google, but fetch_token is mocked,
        # so we only need 'state=' for the CSRF check.
        # request.url is used by flow.fetch_token(), which we are fully mocking here.
        # So, the exact 'code' isn't strictly necessary for this mocked unit test.
        callback_url = '/login/google/callback?state=test_state_value&code=mock_auth_code'

        response = self.client.get(callback_url)

        # 4. Assertions
        self.assertEqual(response.status_code, 200) # Or 302 if redirecting
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Login successful via Google')
        self.assertEqual(data['email'], 'newuser@example.com')

        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user_email'], 'newuser@example.com')
            self.assertEqual(sess['user_name'], 'New Google User')

        user_in_db = self._get_user_by_email('newuser@example.com')
        self.assertIsNotNone(user_in_db)
        self.assertEqual(user_in_db['name'], 'New Google User')
        self.assertEqual(user_in_db['google_id'], 'google_user_123')
        self.assertIsNone(user_in_db['password_hash']) # New Google user shouldn't have a password hash

        mock_flow_instance.fetch_token.assert_called_once()
        mock_requests_get.assert_called_once_with(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': 'Bearer mock_google_token'}
        )

    @patch('app.requests.get')
    @patch('app.google_auth_oauthlib.flow.Flow')
    def test_google_callback_existing_email_no_google_id(self, MockFlow, mock_requests_get):
        # Create a user who signed up with email/password first
        self._create_user('existing@example.com', 'password123')

        mock_flow_instance = MockFlow.from_client_secrets_file.return_value
        mock_credentials = Mock()
        mock_credentials.token = 'mock_google_token_existing'
        mock_flow_instance.credentials = mock_credentials

        mock_user_info = {
            'sub': 'google_id_for_existing',
            'email': 'existing@example.com', # Same email
            'name': 'Existing User Name Update',
            'email_verified': True
        }
        mock_response_get = Mock()
        mock_response_get.ok = True
        mock_response_get.json.return_value = mock_user_info
        mock_requests_get.return_value = mock_response_get

        with self.client.session_transaction() as sess:
            sess['oauth_state'] = 'test_state_for_existing'

        callback_url = '/login/google/callback?state=test_state_for_existing&code=mock_auth_code_existing'
        response = self.client.get(callback_url)

        self.assertEqual(response.status_code, 200) # Or 302
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['email'], 'existing@example.com')

        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user_email'], 'existing@example.com')
            self.assertEqual(sess['user_name'], 'Existing User Name Update')

        user_in_db = self._get_user_by_email('existing@example.com')
        self.assertIsNotNone(user_in_db)
        self.assertEqual(user_in_db['name'], 'Existing User Name Update') # Name should be updated
        self.assertEqual(user_in_db['google_id'], 'google_id_for_existing') # Google ID should be added
        self.assertIsNotNone(user_in_db['password_hash']) # Password hash should still be there

    def test_google_callback_state_mismatch(self):
        with self.client.session_transaction() as sess:
            sess['oauth_state'] = 'correct_state'

        response = self.client.get('/login/google/callback?state=wrong_state&code=anycode')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
        self.assertEqual(data['message'], 'Invalid state or CSRF detected')

    def test_me_route_not_logged_in(self):
        response = self.client.get('/@me')
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['logged_in'])

    @patch('app.requests.get')
    @patch('app.google_auth_oauthlib.flow.Flow')
    def test_me_route_after_google_login(self, MockFlow, mock_requests_get):
        # Simplified setup for callback, focusing on session being set
        mock_flow_instance = MockFlow.from_client_secrets_file.return_value
        mock_credentials = Mock()
        mock_credentials.token = 'mock_token_for_me_test'
        mock_flow_instance.credentials = mock_credentials
        mock_user_info = {'sub': 'gid_me', 'email': 'me_test@example.com', 'name': 'Me Test User'}
        mock_response_get_ok = Mock()
        mock_response_get_ok.ok = True
        mock_response_get_ok.json.return_value = mock_user_info
        mock_requests_get.return_value = mock_response_get_ok

        with self.client.session_transaction() as sess:
            sess['oauth_state'] = 'state_for_me_test'
        self.client.get('/login/google/callback?state=state_for_me_test&code=code_me') # This logs the user in

        # Now test /@me
        response = self.client.get('/@me')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['logged_in'])
        self.assertEqual(data['email'], 'me_test@example.com')
        self.assertEqual(data['name'], 'Me Test User')

    @patch('app.requests.get')
    @patch('app.google_auth_oauthlib.flow.Flow')
    def test_logout_after_google_login(self, MockFlow, mock_requests_get):
        # Log in user via Google (simplified callback)
        mock_flow_instance = MockFlow.from_client_secrets_file.return_value
        mock_credentials = Mock()
        mock_credentials.token = 'token_logout'
        mock_flow_instance.credentials = mock_credentials
        mock_user_info = {'sub': 'gid_logout', 'email': 'logout@example.com', 'name': 'Logout User'}
        mock_response_get_ok = Mock()
        mock_response_get_ok.ok = True
        mock_response_get_ok.json.return_value = mock_user_info
        mock_requests_get.return_value = mock_response_get_ok
        with self.client.session_transaction() as sess:
            sess['oauth_state'] = 'state_logout'
        self.client.get('/login/google/callback?state=state_logout&code=code_logout')

        # Check session exists
        with self.client.session_transaction() as sess:
            self.assertIn('user_email', sess)

        # Perform logout
        response = self.client.post('/logout')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])

        # Check session is cleared
        with self.client.session_transaction() as sess:
            self.assertNotIn('user_email', sess)
            self.assertNotIn('user_name', sess)
            self.assertNotIn('oauth_state', sess) # Ensure oauth_state is also cleared

        # Verify with /@me
        response_me = self.client.get('/@me')
        self.assertEqual(response_me.status_code, 401)


if __name__ == '__main__':
    unittest.main()
