import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'
import {Link} from 'react-router-dom'
import { Segment, Button, Divider, Dimmer, Table, Loader, Message, Container, Form, Select, Header } from 'semantic-ui-react'
import GeoExplMap from './GeoExplMap';
import GeoMappableStats from './GeoMappableStats';


const GeoDataLoad = () => {

    
    let mappedData = []

    const [delaunayData, setDelaunayData ] = useState(null);
    const [data, setData] = useState(null);
    const [usermap, setUsermap] = useState(null);
    const [reducedData, setReduceddata] = useState(null);
    const [mapStatsTot, setMapstatstot] = useState(null);

   //const zoomed = (evt,width,height,context) => this.zoomed(evt,width,height,context);

    const projection = d3.geoMercator()

    const mapStats = (dataset) => {

      const unmappableItems = []
      const unmappableItemsTable = []
      const absentCoordinates = []
      const absentCoordinatesTable = []
      const mappableItems = []

  
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
        mappableItems.push([projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[0],projection([+item.GCcleanPOBlon, +item.GCcleanPOBlat])[1]]);
        mappedData.push(item);

        }

        setMapstatstot([absentCoordinates.length,unmappableItems.length,dataset.length])
        setDelaunayData(mappableItems)
        
        

    })

  }

  const fetchData = () => {
          
      d3.csv(process.env.PUBLIC_URL + "anon_rosterm_id.csv").then(dataset => {
              mapStats(dataset)
              setData(dataset)
            });
        
      d3.json(process.env.PUBLIC_URL + "world_1914.json").then(usermap => {
              setUsermap(usermap)
            });

     /* d3.csv(process.env.PUBLIC_URL + "reduced_data2.csv").then(reducedData => {
        setReduceddata(reducedData)
        }); */
    }

  
    
    useEffect(() => {
    fetchData()
    }, [])

    

  return (data!=null && usermap !== null && delaunayData !== null) ? (        
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
    <GeoMappableStats  unmap = {mapStatsTot}/>
    <Header size='small'>Explore and edit your dataset</Header>
    <Message>Use the map and the table below the map to explore and edit your dataset. You can save the output via the button below.</Message>
    </Container>
    <Divider></Divider>
    <Container>
    <GeoExplMap map = {usermap} data = {delaunayData} />
    </Container>
    
    </>       
            
          ): (<Container>
            <Dimmer active inverted>
              <Loader size='medium' inverted content='Loading' />
            </Dimmer>
          </Container>)     
}

export default GeoDataLoad;