import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3'
import {Delaunay} from 'd3-delaunay';
import { Grid, Container, Card, Icon} from 'semantic-ui-react';
import GeoMapAccordion from './GeoMapAccordion';
import GeoDataFrame from './GeoDataFrame';
import { Tooltip } from 'recharts';


const GeoExplMap = (props) => {

    const canvasContainer = useRef(null);
    const svgContainer = useRef(null);
   // (didn't manage to make the refs work with d3 selections, so I used the ids for now)

    let x = 0;
    let y = 0;
    let k = 1;
    // zoom params also stored in state for svg 
    const [xSvg, setXSvg] = useState(0);
    const [ySvg, setYSvg] = useState(0);
    const [kSvg, setKSvg] = useState(1);
    
    const [totalPoints, setTotalPoints] = useState(0);
    const [displayedPoints, setDisplayedPoints] = useState(0);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipDisplay, setTooltipDisplay] = useState('none');
    
    let mapClickStatus = 'off';
    

    const r = 2.5;
    const mainColor1 = 'rgba(70, 130, 180, .5)' // map circles fill
    const mainColor2 = 'rgba(70, 130, 180, .9)' // map circles stroke
    const mainColor3 = 'rgb(0,0,0)' // circle that appears when clicking on map

    // settings and paths for the basemap

    const projection = d3.geoMercator();

    const path = d3.geoPath()
            .projection(projection);

    let basemap = props.map;

    let map_path = [];

    basemap.features.map((item,index) => {
            map_path.push(<path d={path(item)} style = {{fill: 'rgba(211,211,211,.8)', stroke: 'white', strokeWidth: 0.5}}/>)
        })

    // quadtree enables to draw only the points displayed (zoom)

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

    let quadtreeRes = (data,width,height) => {
        const viewbox = [ [(0 - x) / k, (0 - y) / k],  [(width - x) / k, (height - y) / k]];

        const quadtree = setQuadtree(data);

        const points = searchQuadtree(quadtree,viewbox[0][0],viewbox[0][1],viewbox[1][0],viewbox[1][1]);

        return points

    }

    let drawCanvas = (context,points,width,height,status,p) => {

        if (mapClickStatus === 'off') {
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(x, y);
        context.scale(k, k);
        context.globalAlpha = .7;
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

        if (status == 'mousemove' || status == 'mouseclick') {
            
            context.globalAlpha = 1;
            context.fillStyle = 'rgba(0, 0, 0,.7)';
            context.strokeStyle = 'rgb(0, 0, 0)';
            context.lineWidth = 1;
            
            context.beginPath();

            if (status === 'mousemove') {
                context.moveTo(props.data[p][0] + r, props.data[p][1]);
                context.arc(props.data[p][0], props.data[p][1], r*1.1, 0, 2 * Math.PI);
            }

            if (status === 'mouseclick') {     
                context.arc(props.data[p][0], props.data[p][1], r*3, 0, 2 * Math.PI);
                mapClickStatus = 'on';
            }
            
            context.stroke();
            context.closePath();
            
        }
        
        context.restore();
        context.save(); 

        }
    }



    let mapStats = (points) => {
        const totCircles = points.map((item,index) => +props.reducedData[index].count).reduce((prev, next) => prev + next);
        setTotalPoints(props.mappable);
        setDisplayedPoints(totCircles);
    }


    //zoom is called everytime the map is displayed (with a value of 0 by default), and initiates canvas circles drawing 

    let zoomed = (evt,width,height,context,data,fulldata) => {
        if (evt == 0) {evt = {}; evt.k = 1; evt.x = 0; evt.y = 0;} 
        const points = quadtreeRes(data,width,height)
        drawCanvas(context,points,width,height);
        mapStats(points);
    }

    let mousePreProcess = (evt,data,delaunay,width,height) => {
        let [rmx, rmy] = [evt.layerX, evt.layerY];
        const point = [rmx,rmy]
        const new_point = [(point[0] - x) / k, (point[1] - y) / k];
        const p = delaunay.find(new_point[0], new_point[1]);
        setTooltipData(p);
        setTooltipDisplay('inline');
        const points = quadtreeRes(data,width,height);
        return [p,points]
    }

    let handleMouseMove = (evt,width,height,context,delaunay,data) => {
        if (mapClickStatus === 'off') {
        const res = mousePreProcess(evt,data,delaunay,width,height);
        drawCanvas(context,res[1],width,height,'mousemove',res[0]);
        }
    }

    let handleMouseClick = (evt,width,height,context,delaunay,data) => {

        if (mapClickStatus === 'off') {
            const res = mousePreProcess(evt,data,delaunay,width,height);
            drawCanvas(context,res[1],width,height,'mouseclick',res[0]);
        }

        else if (mapClickStatus == 'on') {
            mapClickStatus = 'off';
            const res = mousePreProcess(evt,data,delaunay,width,height);
            drawCanvas(context,res[1],width,height,'mousemove',res[0]);
        }
        
    }


    let attachEvents = (width,height,context,container,data,fulldata) => {
        const delaunay = Delaunay.from(data);

        container.on("mousemove", evt => {
            handleMouseMove(d3.event,width,height,context,delaunay,data)
          });

        container.on("click", evt => {
            handleMouseClick(d3.event,width,height,context,delaunay,data)
        });
    }


   useEffect(() => {
       
        // width and height are not right when taken from refs
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

       const canvas = d3.select("#canvasContainer").append("canvas").attr('width', width).attr('height', height).style("cursor", "pointer");

       const container = d3.select("#canvasContainer");
       const context = canvas.node().getContext("2d");


        container.call(d3.zoom().on("zoom", function() {
            x = d3.event.transform.x;
            y = d3.event.transform.y;
            k = d3.event.transform.k;
            setXSvg(d3.event.transform.x);
            setYSvg(d3.event.transform.y);
            setKSvg(d3.event.transform.k);
            // didn't manage to create a callback, this would be better as event wouldn't be needed in zoomed func as it would be already in the state
            zoomed(d3.event.transform,width,height,context,props.data, props.fulldata);
            
         }) );

         
        attachEvents(width,height,context,container,props.data, props.fulldata);
        zoomed(0,width,height,context,props.data, props.fulldata);
        

    }, []);



    const TooltipContent = []

       if ( tooltipData!= null) {
            TooltipContent.push(<Card.Content><span>ersatz_id: {props.fullData[tooltipData]['ersatz_id']} | </span><span>rawPOB: {props.fullData[tooltipData]['rawPOB']} | </span><span>GCcleanPOBprec: {props.fullData[tooltipData]['GCcleanPOBprec']}</span></Card.Content>)
       }

    return (
        <>
        <Grid>
            <Grid.Row>
            <Grid.Column width = {3} style = {{marginLeft: '2%'}} />
            <Grid.Column width = {6}>
            <Tooltip />
            <Container ><div style = {{display: tooltipDisplay}}>
                    {TooltipContent}
            </div></Container>
            </Grid.Column>
            <Grid.Column width = {6}>
            <Container fluid textAlign='right'> <p>{displayedPoints} of {totalPoints} mappable observations displayed. <Icon name='info circle' color='grey'></Icon></p>  
            </Container>
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column width = {3} style = {{marginLeft: '2%'}}>
            <GeoMapAccordion />
            </Grid.Column>
            <Grid.Column width = {12}>
                <div style={{position: 'relative'}}>
                <div ref= {canvasContainer} id="canvasContainer" style={{position: 'absolute', top: 0, left: 0}}></div>
                <svg ref = {svgContainer} id="svgContainer" width='100%' height='420' >
                    <g id='map_group' transform={`translate(${xSvg}, ${ySvg}) scale(${kSvg})`}>
                        {map_path}
                    </g>
                </svg>
                </div>
                <GeoDataFrame unmapTab = {props.unmapTab} absTab = {props.absTab}/>
            </Grid.Column>
            </Grid.Row>
            
        </Grid>
         
       </>

    )
}


export default GeoExplMap;