from app import app, oauth
from app.model import User
from flask import json, url_for, session, redirect

@app.route("/google-login")
def googleLogin():
  return oauth.nwHacks_2026_app.authorize_redirect(
    redirect_uri=url_for(
      "googleCallback", 
      _external=True,
    )

    #app.config.get("OAUTH2_REDIRECT_URI")
  )

@app.route("/google-oauth-redirect")
def googleCallback():
  # use authlib to make request to google oauth exchanging authorization code with id and access token
  token = oauth.nwHacks_2026_app.authorize_access_token()

  # store the token in flask-session to store the user log in session
  session["user_token"] = token

  # test to print the session tokens and data
  print(json.dumps(session.get("user_token"), indent=4))

  # redirect the user to the client side root page for now
  #todo: allow for different redirect routes
  return redirect("http://localhost:5173")


@app.route("/logout")
def logout():
  session.pop("user", None)

  # redirect the user to the client side root page for now
  #todo: allow for different redirect routes
  return redirect("http://localhost:5173")