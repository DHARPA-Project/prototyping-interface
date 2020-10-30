import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3'
import {Delaunay} from 'd3-delaunay';
import { Tab, Card, List, Table, Divider, Select, Button, Icon, Header, Message, Dropdown, Container, Form} from 'semantic-ui-react'

const GeoExplMap = (props) => {

    const canvasContainer = useRef(null);
    const svgContainer = useRef(null);
   // (didn't manage to make the refs work with d3 selections, so I used the ids for now)

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [k, setK] = useState(1);

    let basemap = props.map;
    const map_path = [];
    
    // center designates lat and long on which to center the map
    const projection = d3.geoMercator()
        .center([-41.878378,19.826069]);

    const path = d3.geoPath()
            .projection(projection);


    let zoomed = (evt) => {
        
        if (evt == 0) {evt = {}; evt.k = 1; evt.x = 0; evt.y = 0;}
        
        setX(evt.x);
        setY(evt.y);
        setK(evt.k);
        
    }

    basemap.features.map((item,index) => {
        map_path.push(<path d={path(item)} style = {{fill: 'lightGrey', stroke: 'white', strokeWidth: 0.5}}/>)
    })

    


   useEffect(() => {
       
        zoomed(0);

        // width and height are not right when taken from refs
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight;

       const container = d3.select("#canvasContainer");

       const canvas = container.append("canvas").attr('width', width).attr('height', height).style("cursor", "pointer");

       const context = canvas.node().getContext("2d");

       container.call(d3.zoom().on("zoom", function() {
        
            zoomed(d3.event.transform,width,height,context)
         }) );

    }, []);



    return (

        <div style={{position: 'relative'}}>
        <div ref= {canvasContainer} id="canvasContainer" style={{position: 'absolute', top: 0, left: 0}}></div>
        <svg ref = {svgContainer} id="svgContainer" width='100%' height='420' >
            <g id='map_group' transform={`translate(${x}, ${y}) scale(${k})`}>
                {map_path}
            </g>
        </svg>
        </div>

    )

}

export default GeoExplMap;