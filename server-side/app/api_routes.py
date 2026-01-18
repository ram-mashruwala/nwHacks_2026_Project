import random

from app.auth_routes import login_required
from app import app, db
import sqlalchemy as sa
import sqlalchemy.orm as orm
from flask import jsonify, request, session
import finnhub
import uuid
from app.model import User, Strategy, OptionLeg

# print(app.config.get("OAUTH2_CLIENT_ID"))

# # TODO: delete these two later
# @app.route("/")
# @app.route("/index")
# def index():
#     return jsonify({"message": "hello"})

@app.route("/api/get-price", methods=["GET"])
def get_price():
    finnhub_client = finnhub.Client(app.config.get("FINNHUB"))
    stock_symbol = request.args.get('stock')
    if not stock_symbol:
        return jsonify({"error": "Stock symbol is required"}), 400
    
    stock_symbol = stock_symbol.upper()

    try:
        # Fetch Quote (Real-time)
        quote = finnhub_client.quote(stock_symbol)

        if not quote or quote.get("t", 0) == 0 or quote.get("c", 0) == 0:
            return jsonify({"error": "Symbol not found"}), 404
        # Finnhub returns 'c' for Current Price
        # c = Current price, d = Change, dp = Percent change
        current_price = quote['c'] + random.randint(5, 10)
        
        # Check if symbol is invalid (Finnhub returns 0 for bad symbols)
        if current_price == 0:
             return jsonify({"error": "Symbol not found"}), 404

        return jsonify({
            "symbol": stock_symbol,
            "price": current_price,
            "source": "Finnhub (Real-Time)"
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "API Error"}), 500

# Strategies

@app.route("/api/strategies", methods=["POST"])
@login_required
def saveStrategy():

    save_strategy_input_data = request.get_json()

    if not save_strategy_input_data:
        return jsonify({"error": "Data cannot be null"}), 400
    
    if 'name' not in save_strategy_input_data:
        return jsonify({"error": "Invalid data, 'name' is required"}), 400
    
    if 'legs' not in save_strategy_input_data:
        return jsonify({"error": "Invalid data, 'legs' is required"}), 400
    
    name = save_strategy_input_data["name"]
    legs = save_strategy_input_data["legs"]
    stockSymbol = save_strategy_input_data.get("stockSymbol", "")

    # strategy: dict = {
    #     "id": uuid.uuid4(),
    #
    #     "name": name,
    #     "legs": legs,
    #     "stockSymbol": stockSymbol
    # }

    lol = [] # list of legs
    for leg_dict in legs:
        leg = OptionLeg()
        leg.option_type = leg_dict["type"]
        leg.position_type = leg_dict["position"]
        leg.strike = leg_dict["strike"]
        leg.premium = leg_dict["premium"]
        leg.quantity = leg_dict["quantity"]
        
        lol.append(leg)

    strategy = Strategy()
    strategy.name = name
    strategy.stock_symbol = stockSymbol
    strategy.option_legs = lol

    user = db.session.scalars(sa.select(User).where(User.email == session.get("user_token")["userinfo"]["email"])).first()

    if not user.strategies:
        user.strategies = []

    user.strategies.append(strategy)
    db.session.flush()
    db.session.commit()

    # in_memory_strategy_db.append(strategy)

    # print(in_memory_strategy_db)

    option_legs = []
    for option_leg in strategy.option_legs:
        option_legs.append({
            "type": option_leg.option_type,
            "position": option_leg.position_type,
            "strike": option_leg.strike,
            "premium": option_leg.premium,
            "quantity": option_leg.quantity,
        })

    return jsonify({
        "id": strategy.id,
        "name": strategy.name,
        "legs": option_legs,
        "stockSymbol": strategy.stock_symbol,
    }), 201

@app.route("/api/strategies", methods=["GET"])
@login_required
def loadAllStrategies():

    savedStrategies: list[dict] = []

    # savedStrategies = in_memory_strategy_db

    user = db.session.scalars(sa.select(User).where(User.email == session.get("user_token")["userinfo"]["email"])).first()

    for strategy in user.strategies:
        option_legs = []
        for option_leg in strategy.option_legs:
            option_legs.append({
                "type": option_leg.option_type,
                "position": option_leg.position_type,
                "strike": option_leg.strike,
                "premium": option_leg.premium,
                "quantity": option_leg.quantity,
            })

        savedStrategies.append({
            "id": strategy.id,
            "name": strategy.name,
            "legs": option_legs,
            "stockSymbol": strategy.stock_symbol,
        })


    print(savedStrategies)

    return jsonify(savedStrategies)

@app.route("/api/strategies/<int:strategy_id>", methods=["DELETE"])
@login_required
def deleteStrategies(strategy_id: int):
    # global in_memory_strategy_db

    # Filter out the strategy with the matching ID (comparing as strings)
    # in_memory_strategy_db = [
    #     strategy for strategy in in_memory_strategy_db 
    #     if str(strategy.get("id")) != strategy_id
    # ]

    deleted_strategy = db.session.scalar(sa.select(Strategy).where(Strategy.id == strategy_id))

    if not deleted_strategy:
        return

    db.session.delete(deleted_strategy)
    db.session.flush()
    db.session.commit()

    # print(in_memory_strategy_db)

    return jsonify({"message": "success"}), 204

@app.route("/api/alerts", methods=["POST"])
@login_required
def observePrice():
    input_data = request.get_json()
    stockSymbol = input_data["stockSymbol"]
    price = input_data["targetPrice"]
    print(stockSymbol)
    print(price)

    return jsonify({
        "status": "success", 
        "message": f"Alert set for {stockSymbol} at {price}"
    }), 201
