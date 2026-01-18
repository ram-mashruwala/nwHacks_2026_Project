from app import app, oauth, db
from app.model import User
from flask import json, session, redirect, jsonify
import sqlalchemy as sa

# === Check Authenticated Decorator Function ===

# A simple, secure way to check if a user is logged in
def login_required(endpoint_function):
  from functools import wraps
  @wraps(endpoint_function)
  def decorated_function(*args, **kwargs):
      if session.get("user_token") is None:
          # For an API, return a JSON error instead of redirecting
          return jsonify({"error": "Unauthorized"}), 401
      return endpoint_function(*args, **kwargs)
  return decorated_function

# === Auth Routes ===

@app.route("/api/google-login", methods=["GET"])
def googleLogin():
  return oauth.nwHacks_2026_app.authorize_redirect(
    redirect_uri=app.config.get("OAUTH2_REDIRECT_URI")
  )

@app.route("/api/google-oauth-redirect", methods=["GET"])
def googleCallback():
  # use authlib to make request to google oauth exchanging authorization code with id and access token
  token = oauth.nwHacks_2026_app.authorize_access_token()

  # store the token in flask-session to store the user log in session
  session["user_token"] = token
  
  # test to print the session tokens and data
  print(json.dumps(session.get("user_token"), indent=4))

  user = db.session.scalars(sa.select(User).where(User.email == session.get("user_token")["userinfo"]["email"])).first()

  if not user:
    print("Creating User")
    new_user = User(username=session["user_token"]["userinfo"]["name"], email=session["user_token"]["userinfo"]["email"])
    db.session.add(new_user)
    db.session.flush()
    db.session.commit()

  print(user.username)

  # create response function obj equal to redirect fn - redirect the user to the client side root page for now
  #todo: allow for different redirect routes
  return redirect("http://localhost:8080/options")


@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
  session.clear()

  # redirect the user to the client side root page for now
  #todo: allow for different redirect routes
  response = redirect("http://localhost:8080")

  # delete the cookie stored on the client side
  response.delete_cookie('session')
  return response

@app.route("/api/me", methods=["GET"])
@login_required
def getCurrentUserInfo():
  user_info = session.get("user_token")["userinfo"]

  user: dict[str, str] = {
    "name": f"{user_info['given_name']} {user_info['family_name']}",
    "email": f"{user_info['email']}"
  }

  return jsonify(user)
