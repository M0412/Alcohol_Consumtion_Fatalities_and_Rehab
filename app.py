# Importing dependencies
from flask import Flask, render_template, jsonify, request, redirect, url_for
# from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import json

# Creating our app using Flask
app = Flask(__name__)
# CORS(app)

# Using Pymongo to access our alcohol database
client = MongoClient('localhost', 27017)
db = client.alcohol_db

# Route for our home page which will host our html code
@app.route("/")
def index():
    return render_template('index.html')

# Endpoint for our consumption data
@app.route("/consumption", methods=["GET"])
def get_alcohol_consumption():
    col1=db.alcohol_consumption_data
    collections=col1.find()

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)


    return jsonify(json_documents)

# Endpoint for our fatalities data
@app.route("/fatalities", methods=["GET"])
def get_alcohol_fatalities():
    col2=db.alcohol_fatalities_data
    collections=col2.find()

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)
    

    return jsonify(json_documents)

# Endpoint for our rehab facilities data
@app.route("/rehab_facilities", methods=["GET"])
def get_alcohol_facilities():
    col3=db.alcohol_rehabilitation_data
    collections=col3.find({"state_name":{"$ne":""}})

    json_documents =[]
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document)

    return jsonify(json_documents)

# Creating an optional route for the user to access facilities ina specific state
@app.route("/rehab_facilities/state/<state>", methods=["GET"])
def get_rehab_facilities_by_state(state):
    col3 = db.alcohol_rehabilitation_data
    query = {"state_name": state}
    collections = col3.find(query)

    json_documents = []
    for document in collections:
        document.pop('_id', None)
        json_documents.append(document["facilities"])

    return jsonify(json_documents)

# This route will take in the user's state selection
@app.route("/search_by_state", methods=["POST"])
def search_by_state():
    user_input = request.form.get("state_input")
    if user_input:
        state_title_case = user_input.title()
        state_query_param = state_title_case.replace(" ", "%20")
        return redirect(url_for('get_rehab_facilities_by_state', state=state_query_param))
    else:
        return "Please enter a valid state name."

if __name__ == "__main__":
    app.run(debug=True)

# client.close()