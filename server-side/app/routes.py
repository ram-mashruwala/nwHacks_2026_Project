from app import app
from flask import render_template, flash, redirect, request, url_for, session, jsonify
import sqlalchemy as sa
import sqlalchemy.orm as orm

@app.route("/")
@app.route("/")
def index():
    return jsonify({"Message": "Hello from Server!"})
