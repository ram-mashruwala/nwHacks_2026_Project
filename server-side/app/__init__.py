from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate
from flask_socketio import SocketIO

app = Flask(__name__)
app.config.from_object(Config)

socketio = SocketIO(app=app, logger=True, engineio_logger=True)

from app import api_routes, web_socket_routes
