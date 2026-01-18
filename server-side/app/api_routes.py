import random

from app.auth_routes import login_required
from app import app
from flask import jsonify, request
import finnhub
import uuid

# print(app.config.get("OAUTH2_CLIENT_ID"))

# # todo: delete these two later
# @app.route("/")
# @app.route("/index")
# def index():
#     return jsonify({"message": "hello"})

in_memory_strategy_db: list = []

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

    strategy: dict = {
        #TODO: make db create id not server
        "id": uuid.uuid4(),

        "name": name,
        "legs": legs
    }

    in_memory_strategy_db.append(strategy) #todo: replace this with db query

    print(in_memory_strategy_db)

    return strategy

@app.route("/api/strategies", methods=["GET"])
@login_required
def loadAllStrategies():

    savedStrategies: list[dict] = []

    savedStrategies = in_memory_strategy_db #todo: replace this with db query

    print(savedStrategies)

    return savedStrategies
