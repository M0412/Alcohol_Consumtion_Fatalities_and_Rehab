from flask import Flask, render_template, jsonify
# from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import json


app = Flask(__name__)
# CORS(app)

client = MongoClient('localhost', 27017)
db = client.alcohol_db

@app.route("/")
def website():
    return render_template('index.html')

@app.route("/consumption", methods=["GET"])
def get_alcohol_consumption():
    col1=db.alcohol_consumption_data
    collections=col1.find()

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)


    return jsonify(json_documents)

@app.route("/fatalities", methods=["GET"])
def get_alcohol_fatalities():
    col2=db.alcohol_fatalities_data
    collections=col2.find()

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)
    

    return jsonify(json_documents)

@app.route("/rehab_facilities", methods=["GET"])
def get_alcohol_facilities():
    col3=db.alcohol_rehabilitation_data
    collections=col3.find()

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)

    return jsonify(json_documents)

# @app.route("/templates/index.html", methods=["GET"])
# def website():
#     return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=False)

# client.close()