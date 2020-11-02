import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3'
import {Delaunay} from 'd3-delaunay';
import { Dimmer, Container, Loader} from 'semantic-ui-react'

const GeoExplMap = (props) => {

    const canvasContainer = useRef(null);
    const svgContainer = useRef(null);
   // (didn't manage to make the refs work with d3 selections, so I used the ids for now)

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [k, setK] = useState(1);

    const [userCatCol, setUserCatCol] = useState(null);

    const r = 2.5;
    const mainColor1 = 'rgba(70, 130, 180, .5)' // map circles fill
    const mainColor2 = 'rgba(70, 130, 180, .9)' // map circles stroke
    const mainColor3 = 'rgb(0,0,0)' // circle that appears when clicking on map

    const projection = d3.geoMercator();

    const path = d3.geoPath()
            .projection(projection);

    let basemap = props.map;

    let map_path = [];

    basemap.features.map((item,index) => {
            map_path.push(<path d={path(item)} style = {{fill: 'lightGrey', stroke: 'white', strokeWidth: 0.5}}/>)
        })

    let setQuadtree = (data) => {
        const quadtree = d3.quadtree()
        quadtree.addAll(data)
        return quadtree
    }

    let searchQuadtree = (quadtree, x0, y0, x3, y3) => {
        const nodes = []
            quadtree.visit((node, x1, y1, x2, y2) => {
            if (!node.length) {
                do {
                var d = node.data;
                d.scanned = true;
                d.selected = (d[0] >= x0) && (d[0] < x3) && (d[1] >= y0) && (d[1] < y3);
                if (d.selected) nodes.push(d)
                } while (node = node.next);
            }
            return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
            });

            return nodes

    }

    let drawCanvas = (context,points,evt,width,height) => {
        
        
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(evt.x, evt.y);
        context.scale(evt.k, evt.k);
        context.globalAlpha = .5;
        context.lineWidth = .7;

        points.forEach(item => {

            context.fillStyle = mainColor1;
            context.strokeStyle = mainColor2;   
            context.beginPath();
            context.moveTo(item[0] + r, item[1]);
            context.arc(item[0], item[1], r, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
            context.closePath();
        })
        
        context.restore();
        context.save();

    }

    let zoomed = (evt,width,height,context,data) => {
        
        if (evt == 0) {evt = {}; evt.k = 1; evt.x = 0; evt.y = 0;}
        
        const viewbox = [ [(0 - evt.x) / evt.k, (0 - evt.y) / evt.k],  [(width - evt.x) / evt.k, (height - evt.y) / evt.k]];

        const quadtree = setQuadtree(data);

        const points = searchQuadtree(quadtree,viewbox[0][0],viewbox[0][1],viewbox[1][0],viewbox[1][1]);

        drawCanvas(context,points,evt,width,height)
    }

    let singleColorScale = (data) => {

        const colors = ['rgb(47, 126, 188)', 'rgb(24, 100, 170)','rgb(8, 61, 126)' ,'rgb(8,48,107)']

        const interpolate = d3.interpolateRgbBasis(colors);

        const colorScale = d3.scaleLinear()
            .domain([d3.min(data, d => +d.count), d3.max(data, d => +d.count)])
            .range([0, 3]);

        const data2 = data.map((element,index) => (
            { 0:element[0], 1:element[1], scanned: 'true', selected: 'true', color: interpolate(colorScale(+data[index].count)), ersatz_id: data[index].ersatz_id, count: data[index].count, pos: data[index].GCcleanPOBprec
          }));
        
          const tot = data2.map(item => +item.count).reduce((prev, next) => prev + next);
          
    }


   useEffect(() => {
       
        // width and height are not right when taken from refs
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

       const canvas = d3.select("#canvasContainer").append("canvas").attr('width', width).attr('height', height).style("cursor", "pointer");

       const container = d3.select("#canvasContainer");

       const context = canvas.node().getContext("2d");

        container.call(d3.zoom().on("zoom", function() {
            setX(d3.event.transform.x);
            setY(d3.event.transform.y);
            setK(d3.event.transform.k);
            zoomed(d3.event.transform,width,height,context,props.data);
         }) );

        zoomed(0,width,height,context,props.data);

    }, []);

    return (

        <div style={{position: 'relative', marginLeft: '5%'}}>
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