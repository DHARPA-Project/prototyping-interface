import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'
import {Delaunay} from 'd3-delaunay';
import { Tab, Card, List, Table, Divider, Select, Button, Icon, Header, Message, Dropdown, Container, Form} from 'semantic-ui-react'

const GeoExplMap = (props) => {


    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [k, setK] = useState(1);

    let basemap = props.map;
    const map_path = [];
    const projection = d3.geoMercator()
        .center([-41.878378,19.826069]);

    const path = d3.geoPath()
            .projection(projection);

    basemap.features.map((item,index) => {
        map_path.push(<path d={path(item)} style = {{fill: 'lightGrey', stroke: 'white', strokeWidth: 0.5}}/>)
    })



    return (

        <div style={{position: 'relative'}}>
        <div id='containertest' style={{position: 'absolute', top: 0, left: 0}}></div>
        <svg id = 'svgb' width='100%' height='420' >
            <g id='map_group' transform={`translate(${x}, ${y}) scale(${k})`}>
                {map_path}
            </g>
        </svg>
        </div>

    )

}

export default GeoExplMap;