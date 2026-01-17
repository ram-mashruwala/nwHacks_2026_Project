from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

class Base(DeclarativeBase): pass

from app import routes
