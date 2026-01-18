from app import app
from flask import jsonify, request
import finnhub


@app.route("/")
@app.route("/index")
def index():
    return jsonify({"message": "hello"})

@app.route("/getprice")
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
        current_price = quote['c']
        
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

