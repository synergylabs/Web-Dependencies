from flask import Flask
from flask_cors import cross_origin
from box_client import box_client

app = Flask(__name__)


@app.route("/")
def home():
    return "<p>This is a file server!</p>"


@app.route("/country/<country>/service/<service>/month/<month>")
@cross_origin(origins=["http://localhost:80", "http://webdependency.andrew.cmu.edu:8080","http://localhost:80","http://webdependency.andrew.cmu.edu:80"])
def get_file(country, service, month):
    file_content = box_client.get_country_file(country, service, month)
    return {
        "data": file_content,
    }


@app.route("/<country>/<service>/<month>/graph")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080"])
def get_graph_file(country, service, month):
    file_content = box_client.get_graph_file(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }


@app.route("/<country>/<service>/<month>/provider")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080"])
def get_provider_stats(country, service, month):
    file_content = box_client.get_provider_stats(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }


@app.route("/<country>/<service>/<month>/client")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080"])
def get_client_stats(country, service, month):
    file_content = box_client.get_client_stats(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }
