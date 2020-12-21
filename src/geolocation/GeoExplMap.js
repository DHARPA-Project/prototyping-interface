import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3'
import {Delaunay} from 'd3-delaunay';
import { Grid, Container, Card, Icon, Divider, Header} from 'semantic-ui-react';
import GeoMapAccordion from './GeoMapAccordion';
import GeoDataFrame from './GeoDataFrame';
import { Tooltip } from 'recharts';

let x = 0;
let y = 0;
let k = 1;

const GeoExplMap = (props) => {

    const canvasContainer = useRef(null);
    const svgContainer = useRef(null);
   // (didn't manage to make the refs work with d3 selections, so I used the ids for now)


    // zoom params also stored in state for svg 
    let [xSvg, setXSvg] = useState(0);
    let [ySvg, setYSvg] = useState(0);
    let [kSvg, setKSvg] = useState(1);
    
    const [totalPoints, setTotalPoints] = useState(0);
    const [displayedPoints, setDisplayedPoints] = useState(0);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipDisplay, setTooltipDisplay] = useState('none');

    const [tooltip1, setTooltip1] = useState(props.cols[0])
    const [tooltip2, setTooltip2] = useState(props.cols[1])
    const [tooltip3, setTooltip3] = useState(props.cols[2])

    const [delaunayData, setDelaunayData] = useState(props.data)

    const [neighborPoints, setNeigborPoints] = useState(null);

    
    const colors_cat = [d3.schemeSet3[1],d3.schemeSet3[2],d3.schemeSet3[3],d3.schemeSet3[4] ];


    // menu functions //
    // map left menu

    // single color hue display ('overlapping points' in the map menu)
    const [mapColor, setMapColor] = useState('single');
    const [clickCoeff, setClickCoeff] = useState(3)

    let getMapItems = () => {
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 
        const canvas = d3.select('canvas');
        const container = d3.select("#canvasContainer");
        const context = canvas.node().getContext("2d");
        return [width,height,canvas,container,context]
    }

    let handleChangeColor = (e, { value }) => {
        setMapColor(value[0]);
        switch(value[0]) {
            case 'color':
                createColorHue(value[1]);
                break;
            case 'grouped':
                createClusters(value[1]);
                break;
            default:
                resetMap(value[1])

        }
            
      };
  
      let createColorHue = (evt) => {

        const [width,height,canvas,container,context] = getMapItems()
  
        const colors = ['rgb(47, 126, 188)', 'rgb(24, 100, 170)','rgb(8, 61, 126)' ,'rgb(8,48,107)']
  
        const interpolate = d3.interpolateRgbBasis(colors);
  
        const colorScale = d3.scaleLinear()
            .domain([d3.min(props.reducedData, d => +d.count), d3.max(props.reducedData, d => +d.count)])
            .range([0, 3]);
  
        const data = props.data.map((element,index) => (
            { 0:element[0], 1:element[1], color: interpolate(colorScale(+props.reducedData[index].count)), count: +props.reducedData[index].count
          }));
       
        initParams(width,height,context,container,data,props.initDelaunay,0,0)
        attachEvents(evt,width,height,context,container,data,props.initDelaunay,0);
        zoomed(evt,width,height,context,data,0,0)
  
      }

      let createClusters = (evt) => {

        const [width,height,canvas,container,context] = getMapItems()
  
        const data = props.data.map((element,index) => (
            { 0:element[0], 1:element[1], count: +props.reducedData[index].count
          }));
       
        initParams(width,height,context,container,data,props.reducedData,0,'grouped')
        attachEvents(evt,width,height,context,container,data,props.reducedData,'grouped');
        zoomed(evt,width,height,context,data,0,'grouped')
  
      }


      let resetMap = (evt) => {
        setCatlist([]);
        const [width,height,canvas,container,context] = getMapItems()

        initParams(width,height,context,container,props.data,props.initDelaunay,0,0)
        attachEvents(evt,width,height,context,container,props.data,props.initDelaunay,0);
        zoomed(evt,width,height,context,props.data,0,0)
      }

      // categorical display

      const [catList, setCatlist] = useState([]);

      //const used to display a message if user selects columns that contain too many unique values to create categorical display from them
      const [maxCatReached, setMaxCatReached] = useState(null);

      const findColor = (item) => {
        let color = 'rgba(0,0,0,0)';
         switch (item) {
             case "county":
               color = colors_cat[0]
               break;
             case "plus":
                color = colors_cat[1]
               break;
             case "state":
                color = colors_cat[2]
               break;
             case "town":
                 color = colors_cat[3]
               break;
         }

         return color;
     }

     const filterInitData = (filter) => {
         const data = []
         props.mappableAll.map(item =>  {
             if (item['GCcleanPOBprec'] == filter) {
                data.push([[item['GCcleanPOBlon'],item['GCcleanPOBlat']]])
             }
         })
         return data;
        }

     const catData = (value,data) => {

        let newdata = []
        let newitemsdata = []


        switch(value) {            
            case 'all':
                data.map((element,index) => {
                    newdata.push({ 0:element[0], 1:element[1], color: findColor(props.reducedData[index]['GCcleanPOBprec'])})
                });
                newitemsdata = props.initDelaunay;
                break;

            default:
                data.map((element,index) => {
                    if (props.reducedData[index]['GCcleanPOBprec'] == value) {
                        newdata.push({ 0:element[0], 1:element[1], color: findColor(props.reducedData[index]['GCcleanPOBprec'])})
                    }
                });
                //newitemsdata = filterInitData(value);
                newitemsdata = props.initDelaunay;
                break;
        
        }
 
        return [newdata,newitemsdata]

         }

     let displayCategory =  (zoomevt,value,catListItems) => {
        
        let newdata = value === undefined ? catData('all',props.data,catListItems) : catData(value,props.data,catListItems);

        const [width,height,canvas,container,context] = getMapItems()

        initParams(width,height,context,container,newdata[0],newdata[1],0,'cat')
        attachEvents(zoomevt,width,height,context,container,newdata[0],newdata[1],'cat');
        zoomed(zoomevt,width,height,context,newdata[0],0,'cat')
      }
      
      let createCat = (zoomevt,col) => {

        // reset max cat reached
        setMaxCatReached(null);

        // check that thers is less than the max number for categories
        // find the column in the dataframe and count unique values

        // get unique values in selected col
        let extractColumn = (arr, column) => arr.map(x=>x[column]);
        let uniqueCat = [...new Set(extractColumn(props.fullData,col))]

        //check that unique values is not more than 12, if it is, prompt user to select another column instead

        // steps to perform if unique values < 12
        const displayCats = (uniqueCat,col) => {
            const catListItems = [];
            uniqueCat.map((item,index) => {        
                const res =  props.fullData.filter((item) => {
                    return item[col] == uniqueCat[index]
                })
                catListItems.push([uniqueCat[index],res.length,colors_cat[index]])
            })
            setCatlist(catListItems)
            displayCategory(zoomevt,'all',catListItems)
        }

        // display error message if unique values > 12
        const displayError = () => {
            setMaxCatReached(1);
        }

        uniqueCat.length > 12 ? displayError():displayCats(uniqueCat,col)
       
      }

      let createCols = (event,data) => {
        data.value == '' ? resetMap(data.zoomevt):createCat(data.zoomevt,data.value);
        //console.log(data.value)
        //console.log(data.zoomevt)
        
      }

      let tooltipCols = (event,data) => {
        
        if (data.id == 1) {
            setTooltip1(data.value);
        }

        if (data.id == 2) {
            setTooltip2(data.value);
        }

        if (data.id == 3) {
            setTooltip3(data.value);
        }
        
      }

      // radius for neighbour points search
      // this impacts two variables: the size of the circle that is drawn on click on the canvas
      // and the search radius (radiusSearch) that is used for the delaunay.findAll calculation
      // for the moment I didn't manage to have things update upon click on the radio button

      const [radiusSearch, setRadiusSearch] = useState(15);

      let neighbSizeChange = (value) => {
        
        if (value === 'small') {
            setClickCoeff(1.5);
            setRadiusSearch(5);
        }

        if (value === 'medium') {
            setClickCoeff(3.5);
            setRadiusSearch(10);
        }

        if (value === 'large') {
            setClickCoeff(5);
            setRadiusSearch(15);
        }

      }
    
    // end of map menu functions
    
    let mapClickStatus = 'off';

    let r = 3;
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


    let drawCanvas = (zoomevt,context,points,width,height,status1,status2,p) => {
 
        if (mapClickStatus === 'off') {
        context.save();
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.translate(zoomevt.x, zoomevt.y);
        context.scale(zoomevt.k, zoomevt.k);
        context.globalAlpha = .5;
        context.lineWidth = .7; 
        
        let points_sorted;

        if (status2 == 'cat') {
            points_sorted = points.slice().sort((a, b) => d3.ascending(+b.count,+a.count));
        }
        else {
            points_sorted = points.slice().sort((a, b) => d3.ascending(+a.count,+b.count));
        }  

        const radiusScale = d3.scaleLinear()
            .domain([d3.min(props.reducedData, d => +d.count), d3.max(props.reducedData, d => +d.count)])
            .range([3, 20]);

        const getRadius = (status,item) => {
            if (status == 'grouped') {
                r = radiusScale(+item['count'])
            }
            return r
        }

        points_sorted.forEach(item => {
            context.fillStyle = item['color'] || mainColor1;
            context.strokeStyle = mainColor2;   
            context.beginPath();
            context.moveTo(item[0] + getRadius(status2,item), item[1]);
            context.arc(item[0], item[1], getRadius(status2,item), 0, 2 * Math.PI);
            context.stroke();
            context.fill();
            context.closePath();
        })

        if (status1 == 'mousemove' || status1 == 'mouseclick') {
            
            context.globalAlpha = 1;
            context.fillStyle = 'rgba(0, 0, 0,.15)';
            context.strokeStyle = 'rgb(0, 0, 0)';
            context.lineWidth = 1;
            
            context.beginPath();

            if (status1 === 'mousemove') {
                context.moveTo(props.data[p][0] + getRadius(status2,props.reducedData[p]), props.data[p][1]);
                context.arc(props.data[p][0], props.data[p][1], getRadius(status2,props.reducedData[p])*1.1, 0, 2 * Math.PI);
            }

            if (status1 === 'mouseclick') {   
                context.arc(props.data[p][0], props.data[p][1], getRadius(status2,props.reducedData[p])*clickCoeff, 0, 2 * Math.PI);
                mapClickStatus = 'on';
                context.fill();
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

    let zoomed = (zoomevt,width,height,context,data,status1,status2) => {
        if (zoomevt == 0) {zoomevt = {}; zoomevt.k = 1; zoomevt.x = 0; zoomevt.y = 0;} 
        const points = quadtreeRes(data,width,height)
        drawCanvas(zoomevt,context,points,width,height,status1,status2);
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

          const items = delaunay.findAll(x,y,radiusSearch);
          return items
    }

    let mousePreProcess = (evt,data,delaunay,fulldata,width,height) => {
  
        let [rmx, rmy] = [evt.layerX, evt.layerY];
        const point = [rmx,rmy]
        const new_point = [(point[0] - x) / k, (point[1] - y) / k];
        const delaunay2 = Delaunay.from(fulldata);
        const p = delaunay.find(new_point[0], new_point[1]);
        const p2 = delaunay2.find(new_point[0], new_point[1]);
        setTooltipData(p2);
        setTooltipDisplay('inline');
        const points = quadtreeRes(data,width,height);

        return [p,points,new_point]
    }

    let handleMouseMove = (zoomevt,mouseevt,width,height,context,delaunay,data,fulldata,status2) => {
        if (mapClickStatus === 'off') {
        const res = mousePreProcess(mouseevt,data,delaunay,fulldata,width,height);
        drawCanvas(zoomevt,context,res[1],width,height,'mousemove',status2,res[0]);
        }
    }

    let handleMouseClick = (zoomevt,mouseevt,width,height,context,delaunay,data,fulldata,status2) => {

        if (mapClickStatus === 'off') {
            const res = mousePreProcess(mouseevt,data,delaunay,fulldata,width,height);
            drawCanvas(zoomevt,context,res[1],width,height,'mouseclick',status2,res[0]);
            const neighbors = findNeighborPoints(res[2][0],res[2][1])
            setNeigborPoints(neighbors);
        }

        else if (mapClickStatus == 'on') {
            mapClickStatus = 'off';
            const res = mousePreProcess(mouseevt,data,delaunay,fulldata,width,height);
            drawCanvas(zoomevt,context,res[1],width,height,'mousemove',status2,res[0]);
           
        }
        
    }


    let attachEvents = (zoomevt,width,height,context,container,data,fulldata,status2) => {
   
        const delaunay = Delaunay.from(data);
        container.on("mousemove", evt => {
            if (mapClickStatus == 'off') {
                handleMouseMove(zoomevt,d3.event,width,height,context,delaunay,data,fulldata,status2)
            }
            
          });

        container.on("click", evt => {
            handleMouseClick(zoomevt,d3.event,width,height,context,delaunay,data,fulldata,status2)
        });
    }

    let initParams = (width,height,context,container,data,fulldata,status1,status2) => {
        
        container.call(d3.zoom().on("zoom", function() {

            if (mapClickStatus == 'off') {
            x = d3.event.transform.x;
            y = d3.event.transform.y;
            k = d3.event.transform.k;
            setXSvg(d3.event.transform.x);
            setYSvg(d3.event.transform.y);
            setKSvg(d3.event.transform.k);
            attachEvents(d3.event.transform,width,height,context,container,data,fulldata,status2);
            zoomed(d3.event.transform,width,height,context,data,status1,status2);
            }
            
         }) );
        
    }


   useEffect(() => {
       
        // width and height are not right when taken from refs
        const width = document.getElementById('svgContainer').clientWidth;
        const height = document.getElementById('svgContainer').clientHeight; 

        // temporary fix until solution to use d3 with refs is found
        d3.select('canvas').remove();

       const canvas = d3.select("#canvasContainer").append("canvas").attr('width', width).attr('height', height).style("cursor", "pointer");

       const container = d3.select("#canvasContainer");
       const context = canvas.node().getContext("2d");

       initParams(width,height,context,container,props.data,props.initDelaunay,0,0);
       attachEvents(0,width,height,context,container,props.data,props.initDelaunay,0);
       zoomed(0,width,height,context,props.data,0,0);

    }, [clickCoeff]);



    const TooltipContent = []

       if ( tooltipData!= null) {
            TooltipContent.push(<Card.Content><span>{tooltip1}: {props.fullData[tooltipData][tooltip1]} | </span><span>{tooltip2}: {props.fullData[tooltipData][tooltip2]} | </span><span>{tooltip3}: {props.fullData[tooltipData][tooltip3]}</span></Card.Content>)
       }

    return (
        <>
        <Grid>
            <Grid.Row>
            <Grid.Column width = {3} style = {{marginLeft: '2%'}} />
            <Grid.Column width = {7}>
            <Container >
                <div style = {{display: tooltipDisplay}}>
                    {tooltipData!= null &&
                    <Card.Content><span>{tooltip1}: {props.fullData[tooltipData][tooltip1]} | </span><span>{tooltip2}: {props.fullData[tooltipData][tooltip2]} | </span><span>{tooltip3}: {props.fullData[tooltipData][tooltip3]}</span></Card.Content>
                    }   
                </div>
            </Container>
            </Grid.Column>
            <Grid.Column width = {5}>
            <Container fluid textAlign='right'> <p>{displayedPoints} of {totalPoints} mappable observations displayed. <Icon name='info circle' color='grey'></Icon></p>  
            </Container>
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column width = {3} style = {{marginLeft: '2%'}}>
            <GeoMapAccordion colorChange = {handleChangeColor} colorStatus = {mapColor} colOptions = {createCols} catList = {catList} zoomLevel = {{k: kSvg, x: xSvg, y: ySvg}} displayCategory = {displayCategory} cols = {props.cols} tooltipCols = {tooltipCols} neighbSizeChange = {neighbSizeChange } maxCatReached = {maxCatReached}/>
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
                
            </Grid.Column>
            </Grid.Row>

           <Grid.Row>
               <Container text><Header size='small'>4. Edit, save and export your data</Header> </Container>
            </Grid.Row>
       
            <GeoDataFrame neighborsTab = {neighborPoints} unmapTab = {props.unmapTab} absTab = {props.absTab} fullData = {props.fullData} />
            
        </Grid>
        <Divider hidden />
         
       </>

    )
}


export default GeoExplMap;