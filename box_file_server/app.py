from flask import Flask
from flask_cors import cross_origin
from box_client import box_client

app = Flask(__name__)


@app.route("/")
def home():
    return "<p>This is a file server!</p>"


@app.route("/country/<country>/service/<service>/month/<month>")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080","http://localhost","http://webdependency.andrew.cmu.edu","https://localhost:8080", "https://webdependency.andrew.cmu.edu:8080","https://localhost","https://webdependency.andrew.cmu.edu","https://synergylabs.org"])
def get_file(country, service, month):
    file_content = box_client.get_country_file(country, service, month)
    return {
        "data": file_content,
    }

@app.route("/country/<country>/service/<service>/month/<month>/list")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080","http://localhost","http://webdependency.andrew.cmu.edu","https://localhost:8080", "https://webdependency.andrew.cmu.edu:8080","https://localhost","https://webdependency.andrew.cmu.edu","https://synergylabs.org"])
def get_file_lists(country, service, month):
    file_list = box_client.get_file_lists(country, service, month)
    return {
        "data": file_list,
    }


@app.route("/<country>/<service>/<month>/graph")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080","http://localhost","http://webdependency.andrew.cmu.edu","https://localhost:8080", "https://webdependency.andrew.cmu.edu:8080","https://localhost","https://webdependency.andrew.cmu.edu","https://synergylabs.org"])
def get_graph_file(country, service, month):
    file_content = box_client.get_graph_file(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }


@app.route("/<country>/<service>/<month>/provider")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080","http://localhost","http://webdependency.andrew.cmu.edu","https://localhost:8080", "https://webdependency.andrew.cmu.edu:8080","https://localhost","https://webdependency.andrew.cmu.edu","https://synergylabs.org"])
def get_provider_stats(country, service, month):
    file_content = box_client.get_provider_stats(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }


@app.route("/<country>/<service>/<month>/client")
@cross_origin(origins=["http://localhost:8080", "http://webdependency.andrew.cmu.edu:8080","http://localhost","http://webdependency.andrew.cmu.edu","https://localhost:8080", "https://webdependency.andrew.cmu.edu:8080","https://localhost","https://webdependency.andrew.cmu.edu","https://synergylabs.org"])
def get_client_stats(country, service, month):
    file_content = box_client.get_client_stats(country, service, month)
    return {
        "data": file_content.decode('utf-8'),
    }
