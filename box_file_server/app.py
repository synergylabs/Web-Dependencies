from flask import Flask
from flask_cors import cross_origin
from box_client import box_client

app = Flask(__name__)


@app.route("/")
def home():
    return "<p>This is a file server!</p>"


@app.route("/country/<country>/service/<service>/month/<month>")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080"])
def get_file(country, service, month):
    file_content = box_client.get_file(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }
