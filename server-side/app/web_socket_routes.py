from flask_socketio import emit
from app import socketio

@socketio.event
def connect(auth):
    print("User Connected!")

@socketio.event
def disconnect():
    print("User Disconnected :(")

@socketio.on("test")
def test(data):
    print(data)
