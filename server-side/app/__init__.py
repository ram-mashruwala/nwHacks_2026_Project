from flask import Flask
<<<<<<< HEAD
=======
from flask_cors import CORS
from config import Config
>>>>>>> 66f7acc (Finish auth implementation, add Finnhub, and clean up session files)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate
from flask_socketio import SocketIO
from authlib.integrations.flask_client import OAuth
<<<<<<< HEAD
from config import Config
=======
from flask_session import Session
>>>>>>> 66f7acc (Finish auth implementation, add Finnhub, and clean up session files)

app = Flask(__name__)
app.config.from_object(Config)

<<<<<<< HEAD

=======
# Server-side Session
Session(app)

# Database
>>>>>>> 66f7acc (Finish auth implementation, add Finnhub, and clean up session files)
class Base(DeclarativeBase): pass
db = SQLAlchemy(model_class=Base, app=app)
migrate = Migrate(app, db)

# Cors
CORS(app, origins=[
  # "https://myapp.com", 
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:5000"
], supports_credentials=True)

# OAuth
oauth = OAuth(app=app)
oauth.register("nwHacks_2026_app",
  client_id=app.config.get("OAUTH2_CLIENT_ID"),
  client_secret=app.config.get("OAUTH2_CLIENT_SECRET"),
  server_metadata_url=app.config.get("OAUTH2_META_URL"),
  client_kwargs={
      "scope": "openid profile email",
  }
)

# Websocket
socketio = SocketIO(app=app,
 logger=True,
 engineio_logger=True,
 cors_allowed_origins="*", # this is very dangerous but it's fineeeee
 async_mode='threading'
)
# socketio = SocketIO(app, async_mode='threading')

from app import api_routes, web_socket_routes, auth_routes
