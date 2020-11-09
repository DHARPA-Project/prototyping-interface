import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'
import {Link} from 'react-router-dom'
import { Button, Divider, Dimmer, Table, Loader, Message, Container, Form, Select, Header } from 'semantic-ui-react'
import GeoExplMap from './GeoExplMap';
import GeoMappableStats from './GeoMappableStats';


const unmappableItems = []
const absentCoordinates = []
const fullItems = []
const mappableItems = [] 

// variables for tables that will be displayed under the map for missing and unmappable coordinates
const unmappableItemsTable = []
const absentCoordinatesTable = []


const GeoDataLoad = () => {

    const [fullData, setFullData] = useState(null);
    const [delaunayData, setDelaunayData ] = useState(null);
    const [reducedData, setReducedData ] = useState(null);
    const [usermap, setUsermap] = useState(null);

    const projection = d3.geoMercator()


  const fetchData = () => {

          
      d3.csv(process.env.PUBLIC_URL + "anon_rosterm_id.csv").then(dataset => {
  
        dataset.map((item,index ) => {
  
          if (isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0]) || isNaN(projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1])) {
            unmappableItems.push(item)
            unmappableItemsTable.push(<Table.Row>
              <Table.Cell>{item['ersatz_id']}</Table.Cell>
              <Table.Cell>{item['rawPOB']}</Table.Cell>
              <Table.Cell>{item['GCcleanPOBprec']}</Table.Cell>
            </Table.Row>)
          }
        
          if ( +item.GCcleanPOBlon == 0 || +item.GCcleanPOBlon == 0) {
            absentCoordinates.push(item)
            absentCoordinatesTable.push(<Table.Row>
              <Table.Cell>{item['ersatz_id']}</Table.Cell>
              <Table.Cell>{item['rawPOB']}</Table.Cell>
              <Table.Cell>{item['GCcleanPOBprec']}</Table.Cell>
            </Table.Row>)
          }
  
          else {
  
            // full dataset will be used when finding a point on map with delaunay (unique locations), so that all points with same coords can be retrieved and inserted into dataframe view
            fullItems.push(item);
  
          }

        }); }).then(() => {
          setFullData(fullItems)

        });

      // following dataset will be created with Python from the first dataset after user upload, in order to group circles that have same coordinates and provide with a "count" column used for single color hue/displaying one point on the map for same location to improve perf
     
      d3.csv(process.env.PUBLIC_URL + "reduced_data2.csv").then(reducedData => { 

          setReducedData(reducedData);
          reducedData.map((item,index) => {    
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

    

  return (usermap !== null && delaunayData !== null && fullData !== null && unmappableItems !== null) ? (        
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
    <GeoMappableStats  stats = {[absentCoordinates.length,unmappableItems.length,fullItems.length]}/>
    <Header size='small'>Explore and edit your dataset</Header>
    <Message>Use the map and the table below the map to explore and edit your dataset. You can save the output via the button below.</Message>
    </Container>
    <Divider hidden />

    <GeoExplMap map = {usermap} data = {delaunayData} fullData = {fullData} reducedData = {reducedData}/>
    
    </>       
            
          ): (<Container>
            <Dimmer active inverted>
              <Loader size='medium' inverted content='Loading' />
            </Dimmer>
          </Container>)     
}

export default GeoDataLoad;

 

