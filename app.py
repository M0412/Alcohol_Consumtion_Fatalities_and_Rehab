from flask import Flask, render_template
from pymongo import MongoClient


app = Flask(__name__)

# client = MongoClient('localhost', 27017)

@app.route("/")
def website():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=False)