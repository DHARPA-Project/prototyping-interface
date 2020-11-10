import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'
import {Link} from 'react-router-dom'
import { Button, Divider, Dimmer, Table, Loader, Message, Container, Form, Select, Header } from 'semantic-ui-react'
import GeoExplMap from './GeoExplMap';
import GeoMappableStats from './GeoMappableStats';

const unmappableItems = []
const absentCoordinates = []
const mappableItems = [] // with just lat and long for delaunay processes
const fullMappableItems = [] // with all columns 
const initDataDelaunay = []

const GeoDataLoad = () => {

    // Map displays points from "reduced" dataset, and tooltips will be displayed for points that are visible
    // Access to initial/complete dataset is necessary to display neighbour/overlapping points

     // json map uploaded by user
     const [usermap, setUsermap] = useState(null);

     // dataframe with unique places that will be created in Python from user data (for the moment it is created with a notebook)
     const [reducedData, setReducedData ] = useState(null);

    // mappable items from reduced dataset
    const [fullData, setFullData] = useState(null);

    // mappable items from reduced dataset with just lat and long for delaunay calculation for finding circle index for tooltip
    const [delaunayData, setDelaunayData ] = useState(null);

    // initial dataset length
    const [userDataLen, setUserDataLen] = useState(null);

    // initial dataset: mappable items with just lat and long for delaunay calculations for finding multiple/overlapping circles 
    const [delaunayInitData, setDelaunayInitData] = useState(null);
    

    const projection = d3.geoMercator()


    const fetchData = () => {

      d3.csv(process.env.PUBLIC_URL + "anon_rosterm_id.csv").then(dataset => {
        setUserDataLen(dataset.length); 
        
        dataset.map((item,index ) => {
          if (isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0]) || isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1])) {
            unmappableItems.push(item)
          }
        
          else if ( +item.GCcleanPOBlon == 0 || +item.GCcleanPOBlat == 0 || +item.GCcleanPOBlon == '' ||   +item.GCcleanPOBlat == '') {
            absentCoordinates.push(item)
          }
  
          else {

            initDataDelaunay.push([projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0],projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1]]);

            // full dataset will be used when finding a point on map with delaunay (unique locations), so that all points with same coords can be retrieved and inserted into dataframe view
            fullMappableItems.push(item);
  
          }

        }); }).then(() => {
          setFullData(fullMappableItems);
          setDelaunayInitData(initDataDelaunay);

        });

      // "reduced data" dataset will be created with Python from the first dataset after user upload, in order to group circles that have same coordinates and provide with a "count" column used for single color hue/displaying one point on the map for same location to improve perf
     
      d3.csv(process.env.PUBLIC_URL + "reduced_data2.csv").then(reducedData => { 

        const reducedDataMappable = reducedData.filter((item,index) => {
          
          return  ((!isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0]) || !isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1])) || +item.GCcleanPOBlon !== 0 || +item.GCcleanPOBlat !== 0 || +item.GCcleanPOBlon !== ' ' ||   +item.GCcleanPOBlat !== ' ' )
        })

        setReducedData(reducedDataMappable);
          reducedDataMappable.map((item,index) => {    
                mappableItems.push([projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0],projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1]]);
            })
          }).then(() => {
            setDelaunayData(mappableItems);
          }); 
        
      d3.json(process.env.PUBLIC_URL + "world_1914.json").then(usermap => {
              setUsermap(usermap)
            });

  }
    
    useEffect(() => {
    fetchData()
    }, [])

    

  return (usermap !== null && delaunayData !== null && fullData !== null && unmappableItems !== null && delaunayInitData !== null) ? (        
    <>
    <Container text>
    <Header size='small'>Upload data and basemap</Header>
    <Button icon='upload' content = 'Upload dataset (csv)' />
    <Button.Group>
    <Button>Load default basemap</Button>
    <Button.Or />
    <Button>Upload your own</Button>
    </Button.Group>
    <Divider></Divider>
    <Header size='small'>Select latitude and longitude</Header>
    <Message>To enable map display, indicate which columns of your dataset describe latitude and longitude.</Message>
    <Form size='mini'>
        <Form.Group widths='equal'>
        <Form.Field
          control={Select}
          label = 'Latitude'
          placeholder='Latitude'
        />
        <Form.Field
          control={Select}
          label = 'Longitude'
          placeholder='Longitude'
        />
        </Form.Group>
        <Form.Button size = 'small'>Update</Form.Button> 
    </Form>

    <Divider></Divider>
    <Header size='small'>Unmappable observations</Header>
        <Message>The table below provides information about points that couldn't be plotted on the map, and points without latitude and longitude.</Message>
    <GeoMappableStats  stats = {[absentCoordinates.length,unmappableItems.length,fullMappableItems.length, userDataLen]}/>
    <Header size='small'>Explore and edit your dataset</Header>
    <Message>Use the map and the table below the map to explore and edit your dataset. You can save the output via the button below.</Message>
    </Container>
    <Divider hidden />

    <GeoExplMap map = {usermap} data = {delaunayData} fullData = {fullData} reducedData = {reducedData} unmapTab = {unmappableItems} absTab = {absentCoordinates} mappable = {fullMappableItems.length} initDelaunay = {delaunayInitData}/>
    
    </>       
            
          ): (<Container>
            <Dimmer active inverted>
              <Loader size='medium' inverted content='Loading' />
            </Dimmer>
          </Container>)     
}

export default GeoDataLoad;

 

