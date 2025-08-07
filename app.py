from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(debug=True, port=8080)
