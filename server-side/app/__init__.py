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
oauth.register("nwHacks 2026",
               )

socketio = SocketIO(app=app,
 logger=True,
 engineio_logger=True,
 cors_allowed_origins="*" # this is very dangerous but it's fineeeee
)
from app import api_routes, web_socket_routes, authentication_routes
