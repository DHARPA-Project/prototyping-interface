import os
from flask import Flask
from flask_cors import CORS
from dataprocess.geo_overlapping import geo_overlapping_merge

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.debug = 'DEBUG' in os.environ

CORS(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/geo_file1/<file_exceptions>/<file_name>/')
def geo_file1(file_exceptions,file_name):
    #file_name is the name of the file uploaded by user
    # collect id of unmappable items listed as a string in file_exception
    exceptions = file_exceptions.split('-')
    exceptions = [int(i) for i in exceptions] 
    reduced_data = geo_overlapping_merge(file_name,exceptions)

    result = {
        "reduced-data": reduced_data
    }
    return result