## General
This prototyping interface's goal is to enable the production of functional prototypes for user testing purposes in the context of the DHARPA project.
It is built with a React front-end and a Python backend. Both end exchange data via Flask. User actions that trigger operations on their initial dataset (such as edits or advanced data analysis) are processed by Python and then sent back to the front-end.

## Current stage
The available code is currently under development and isn't for the moment fully functional.<br/>
The first modules should reach a Minimum Viable Product Test stage in the next weeks and months. This means that they will be ready for user testing, in order to enable further functionalities and design iterations, before being fully developed and released (probably with a different technical stack) as an alpha and then beta version.

## Installation and running the project
The installation set-up may vary depending on the tools you are using and on your OS, this is an example. 
Please note that at the moment the workflow that is being developed (Geolocation) relies on licensed data that is kept private, so the module won't run. This module's code will soon be generalised to work with any dataset.

**First Installation** <br>

Requirements: Node.js/Npm and Python3

1. Clone or download the repository and navigate there via your terminal
2. run the following command
```
npm install
```
3. create a Python virtual environment and install python dependencies
```
python3 -m venv venv
```
```
. venv/bin/activate
```
 ```
 pip3 install -r requirements.txt 
 ```

**Running the project**
1. Open a first terminal window, navigate to the project, and run the following commands:
```
. venv/bin/activate
```
 ```
 flask run
 ```
 2. Open a second terminal window, navigate to the project, and run the following command:
 ```
 npm start
 ```


### Home Page
At this stage, only the Geolocation workflow is active, on the left part of the panel.

### Geolocation workflow
Contributors:<br/>
Dr. Angela R. Cunningham, Postdoctoral Research Associate<br/>
angela.cunningham@uni.lu<br/>
Mariella de Crouy Chanel, Developer<br/>
mariella.decrouychanel@uni.lu<br/>
DHARPA Team<br/>
dharpa@uni.lu

## Geolocation workflow, step 1 ##
The first step of the geolocation workflow assists users in editing their dataframe through map exploration.<br/>
Requirement: CSV file containing coordinates, in the form of a latitude and a longitude column.<br>
**Functionalities**
1. Map exploration
- Information about mappable and unmappable rows
- Zooming and panning, information about the number of observations displayed on the map
- Hovering on a point to display tooltip information, clicking on a point to display a list of neighbour points in a table below the map
- Selection of columns to display in map tooltip
- Handling overlapping points display, either by displaying darker points, or by displaying bigger circles proportional in size to the number of overlapping points
- Create a categorical view on the unique values from a column
- Filtering points displayed on map





