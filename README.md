## General
This prototyping interface's goal is to enable the production of functional prototypes for user testing purposes.
It is built with a React front-end and a Python backend. Both end exchange data via Flask. User actions that trigger operations on their initial dataset (such as edits or advanced data analysis) are processed by Python and then sent back to the front-end.

## Current stage
The available code is currently under development and isn't for the moment fully functional.
The first modules should reach a Minimum Viable Product Test stage in the next weeks and months. This means that they will be ready for user testing, in order to enable further functionalities and design iterations, before being released (probably with a different technical stack) as an alpha and then beta version.

## Installation and running the project
The installation set-up may vary depending on the tools you are using and on your OS, this is an example. 
Please note that at the moment the workflow that is being developed (Geolocation) relies on licensed data that is kept private, so the module won't run. This module's code will soon be generalised to work with any dataset.

<b>Installation</b>
Requirements: Node.js/Npm and Python3 need to be intalled on your computer.
1. Clone or download the repository and navigate there via your terminal
2. run the following command: npm install
3. create a Python virtual environment: python3 -m venv venv

<b>Running the project</b>
1. Open a first terminal window, navigate to the project, and run the following commands:
 - . venv/bin/activate
 - pip3 install -r requirements.txt
 2. Open a second terminal window, navigate to the project, and run the following command:
 - npm start

## How to use

### 1. Home Page
At this stage, only the Geolocation workflow is active, on the left part of the panel.
