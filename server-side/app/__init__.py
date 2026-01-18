from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate
from flask_socketio import SocketIO
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.config.from_object(Config)

class Base(DeclarativeBase): pass
db = SQLAlchemy(model_class=Base, app=app)
migrate = Migrate(app, db)

oauth = OAuth(app=app)
oauth.register("nwHacks_2026_app",
  client_id=app.config.get("OAUTH2_CLIENT_ID"),
  client_secret=app.config.get("OAUTH2_CLIENT_SECRET"),
  server_metadata_url=app.config.get("OAUTH2_META_URL"),
  client_kwargs={
      "scope": "openid profile email",
  }
)

socketio = SocketIO(app=app,
 logger=True,
 engineio_logger=True,
 cors_allowed_origins="*" # this is very dangerous but it's fineeeee
)

from app import api_routes, web_socket_routes, auth_routes
