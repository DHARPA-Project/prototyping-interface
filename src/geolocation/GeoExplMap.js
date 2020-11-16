import React, { useState, useEffect, useRef, createFactory } from 'react';
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
    let [xSvg, setXSvg] = useState(0);
    let [ySvg, setYSvg] = useState(0);
    let [kSvg, setKSvg] = useState(1);
    
    const [totalPoints, setTotalPoints] = useState(0);
    const [displayedPoints, setDisplayedPoints] = useState(0);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipDisplay, setTooltipDisplay] = useState('none');

    const [delaunayData, setDelaunayData] = useState(props.data)

    const [neighborPoints, setNeigborPoints] = useState(null);



    // menu functions //
    // map left menu (dataframe)

    // single color hue display ('overlapping points' in the map menu)
    const [mapColor, setMapColor] = useState('single');

    let handleChangeColor = (e, { value }) => {
        setMapColor(value[0]);
        value[0] == 'color' ? createColorHue(value[1]) : resetMap(value[1])
      };
  
      let createColorHue = (evt) => {
  
        const colors = ['rgb(47, 126, 188)', 'rgb(24, 100, 170)','rgb(8, 61, 126)' ,'rgb(8,48,107)']
  
        const interpolate = d3.interpolateRgbBasis(colors);
  
        const colorScale = d3.scaleLinear()
            .domain([d3.min(props.reducedData, d => +d.count), d3.max(props.reducedData, d => +d.count)])
            .range([0, 3]);

       /* const toRgba = (color) => {
            const matches = color.match(/\d+/g);
            return `rgba(${matches[0]},${matches[1]},${matches[2]},.8)`
        } */
  
        const data = props.data.map((element,index) => (
            { 0:element[0], 1:element[1], color: interpolate(colorScale(+props.reducedData[index].count)), count: +props.reducedData[index].count
          }));

  
        // width and height are not right when taken from refs this is why I'm using JS DOM selection
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

        const canvas = d3.select('canvas');

        const container = d3.select("#canvasContainer");
        const context = canvas.node().getContext("2d");

        initParams(width,height,context,container,data,props.fulldata,0)
        attachEvents(evt,width,height,context,container,data,props.fulldata);
        zoomed(evt,width,height,context,data,0)
  
      }

      let resetMap = (evt) => {

        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

        const canvas = d3.select('canvas');

        const container = d3.select("#canvasContainer");
        const context = canvas.node().getContext("2d");

        initParams(width,height,context,container,props.data,props.fulldata,0)
        attachEvents(evt,width,height,context,container,props.data,props.fulldata);
        zoomed(evt,width,height,context,props.data,0)

      }

      // categorical display

      const [catList, setCatlist] = useState([]);
      
      let createCat = (zoomevt) => {

        const colors_cat = ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'];
        const cats = ['blank', 'county', 'plus', 'state', 'town'];
        const catListItems = [];

        cats.map((item,index) => {        
            const res =  props.fullData.filter((item) => {
                return item['GCcleanPOBprec'] == cats[index]
            })
            catListItems.push([cats[index],res.length,colors_cat[index]])
        })

        setCatlist(catListItems)

        const findColor = (item) => {
            let color = 'rgba(0,0,0,0)';
             switch (item) {
                 case "blank":
                   color = d3.schemeSet3[0];
                   break;
                 case "county":
                   color = d3.schemeSet3[1];
                   break;
                 case "plus":
                 color = d3.schemeSet3[2];
                   break;
                 case "state":
                   color = d3.schemeSet3[3];
                   break;
                 case "town":
                   color = d3.schemeSet3[4];
                   break;
             }
 
             return color;
         }

         const data = props.data.map((element,index) => (
            { 0:element[0], 1:element[1], color: findColor(props.reducedData[index]['GCcleanPOBprec'])
          }));

        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

        const canvas = d3.select('canvas');

        const container = d3.select("#canvasContainer");
        const context = canvas.node().getContext("2d");

        initParams(width,height,context,container,data,props.fulldata,0)
        attachEvents(zoomevt,width,height,context,container,data,props.fulldata);
        zoomed(zoomevt,width,height,context,data,0)

      }

      let createCols = (event,data) => {
        
        data.value == '' ? resetMap(data.zoomevt):createCat(data.zoomevt);
        

      }
      /*
        let handleChangeColor = (e, { value }) => {
        setMapColor(value[0]);
        value[0] == 'color' ? createColorHue(value[1]) : resetMap(value[1])
      };


      let createCols = (event,data) => {
       
       
       
        /* this.setState({clickCircle:null})
       if (data.value == '') {
        this.setState({dataset_user: null, dataset_status: null, legend_display: 'none'})
        
        this.zoomed(0,this.state.width,this.state.height,this.state.context,'false');
        
       }
       else {
        d3.csv(process.env.PUBLIC_URL + "user_df_groupby.csv").then(dataset => {
          this.setState({dataset_user: dataset, dataset_status: data.value})
          this.handleCategories(this.state.width,this.state.height,this.state.context);
        });
       } 
        
      }
    */
    

    // end of map menu functions

   

    
    let mapClickStatus = 'off';
    

    const r = 3;
    const mainColor1 = 'rgba(70, 130, 180, .8)' // map circles fill
    const mainColor2 = 'rgba(70, 130, 180, 1)' // map circles stroke
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


    let drawCanvas = (zoomevt,context,points,width,height,status,p) => {

 
        if (mapClickStatus === 'off') {
       context.save();
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.translate(zoomevt.x, zoomevt.y);
        context.scale(zoomevt.k, zoomevt.k);
        context.globalAlpha = .5;
        context.lineWidth = .7; 
        
        let points_sorted;

        if (status == 'cat') {
            points_sorted = points.slice().sort((a, b) => d3.ascending(+b.count,+a.count));

        }
        else {
            points_sorted = points.slice().sort((a, b) => d3.ascending(+a.count,+b.count));
        }

        

        points_sorted.forEach(item => {
            context.fillStyle = item['color'] || mainColor1;
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

    let zoomed = (zoomevt,width,height,context,data,status) => {
        if (zoomevt == 0) {zoomevt = {}; zoomevt.k = 1; zoomevt.x = 0; zoomevt.y = 0;} 
        const points = quadtreeRes(data,width,height)
        drawCanvas(zoomevt,context,points,width,height,status);
        mapStats(points);
    }

    let findNeighborPoints = (x,y) => {
        const delaunay = Delaunay.from(props.initDelaunay);
        delaunay.findAll = function(x, y, radius) {
            const points = delaunay.points,
                  results = [],
                  seen = [],
                  queue = [delaunay.find(x, y)];
          
            while (queue.length) {
              const q = queue.pop();
              if (seen[q]) continue;
              seen[q] = true;
              if (Math.hypot(x - points[2*q], y - points[2*q+1]) < radius) {
                results.push(q);
                for (const p of delaunay.neighbors(q)) queue.push(p);
              }
            }
            return results;
          }

          const items = delaunay.findAll(x,y,25);
          return items
    }

    let mousePreProcess = (evt,data,delaunay,width,height) => {
        let [rmx, rmy] = [evt.layerX, evt.layerY];
        const point = [rmx,rmy]
        const new_point = [(point[0] - x) / k, (point[1] - y) / k];
        const delaunay2 = Delaunay.from(props.initDelaunay);
        const p = delaunay.find(new_point[0], new_point[1]);
        const p2 = delaunay2.find(new_point[0], new_point[1]);
        setTooltipData(p2);
        setTooltipDisplay('inline');
        const points = quadtreeRes(data,width,height);
        return [p,points,new_point]
    }

    let handleMouseMove = (zoomevt,mouseevt,width,height,context,delaunay,data,container) => {
        if (mapClickStatus === 'off') {
        const res = mousePreProcess(mouseevt,data,delaunay,width,height);
        drawCanvas(zoomevt,context,res[1],width,height,'mousemove',res[0]);
        }
    }

    let handleMouseClick = (zoomevt,mouseevt,width,height,context,delaunay,data) => {

        if (mapClickStatus === 'off') {
            const res = mousePreProcess(mouseevt,data,delaunay,width,height);
            drawCanvas(zoomevt,context,res[1],width,height,'mouseclick',res[0]);
            const neighbors = findNeighborPoints(res[2][0],res[2][1])
            setNeigborPoints(neighbors);
        }

        else if (mapClickStatus == 'on') {
            mapClickStatus = 'off';
            const res = mousePreProcess(mouseevt,data,delaunay,width,height);
            drawCanvas(zoomevt,context,res[1],width,height,'mousemove',res[0]);
           
        }
        
    }


    let attachEvents = (zoomevt,width,height,context,container,data) => {
        
        const delaunay = Delaunay.from(data);

        container.on("mousemove", evt => {
            if (mapClickStatus == 'off') {
                handleMouseMove(zoomevt,d3.event,width,height,context,delaunay,data,container)
            }
            
          });

        container.on("click", evt => {
            handleMouseClick(zoomevt,d3.event,width,height,context,delaunay,data)
        });
    }

    let initParams = (width,height,context,container,data,fulldata,status) => {
        
        container.call(d3.zoom().on("zoom", function() {
            if (mapClickStatus == 'off') {
            x = d3.event.transform.x;
            y = d3.event.transform.y;
            k = d3.event.transform.k;
            setXSvg(d3.event.transform.x);
            setYSvg(d3.event.transform.y);
            setKSvg(d3.event.transform.k);
            attachEvents(d3.event.transform,width,height,context,container,data,fulldata);
            zoomed(d3.event.transform,width,height,context,data,status);
            }
            
         }) );
        
    }


   useEffect(() => {
       
        // width and height are not right when taken from refs
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

       const canvas = d3.select("#canvasContainer").append("canvas").attr('width', width).attr('height', height).style("cursor", "pointer");

       const container = d3.select("#canvasContainer");
       const context = canvas.node().getContext("2d");

       initParams(width,height,context,container,props.data,props.fulldata,0);
       attachEvents(0,width,height,context,container,props.data,props.fulldata);
       zoomed(0,width,height,context,props.data,0);
       

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
            <Grid.Column width = {7}>
            <Tooltip />
            <Container ><div style = {{display: tooltipDisplay}}>
                    {TooltipContent}
            </div></Container>
            </Grid.Column>
            <Grid.Column width = {5}>
            <Container fluid textAlign='right'> <p>{displayedPoints} of {totalPoints} mappable observations displayed. <Icon name='info circle' color='grey'></Icon></p>  
            </Container>
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column width = {3} style = {{marginLeft: '2%'}}>
            <GeoMapAccordion colorChange = {handleChangeColor} colorStatus = {mapColor} colOptions = {createCols} catList = {catList} zoomLevel = {{k: kSvg, x: xSvg, y: ySvg}} />
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
                <GeoDataFrame neighborsTab = {neighborPoints} unmapTab = {props.unmapTab} absTab = {props.absTab} fullData = {props.fullData} />
            </Grid.Column>
            </Grid.Row>
            
        </Grid>
         
       </>

    )
}


export default GeoExplMap;