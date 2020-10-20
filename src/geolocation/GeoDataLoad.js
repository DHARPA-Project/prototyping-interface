import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'
import {Link} from 'react-router-dom'
import { Segment, Button, Divider, Dimmer, Loader, Message, Container, Form, Select, Header } from 'semantic-ui-react'


const removeSpaces = (d) => { 
    Object.keys(d).forEach(function(origProp) {
        const noSpace = replaceAll(origProp," ", "_");
        d[noSpace] = d[origProp];
    });
    return d;
}

const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
}

/*const tooltipOptions = [
    { key: 'bz', value: 'bz', text: 'ersatz_id' },
    { key: 'bj', value: 'bj', text: 'rawPoB' },
  ] */


const GeoDataLoad = () => {

    const [data, setData] = useState(null);
    const [usermap, setUsermap] = useState(null);

   const fetchData = () => {
        d3.csv(process.env.PUBLIC_URL + "anon_rosterm_id.csv").then(dataset => {
            const cols = dataset.columns.length
            setData(dataset)
            console.log(dataset)
          });
      
        d3.json(process.env.PUBLIC_URL + "world_1914.json").then(usermap => {
            setUsermap(usermap)
            console.log(usermap)
        })
    }
    
      useEffect(() => {
        fetchData()
      }, [])

    

  return (data!=null && usermap !== null) ? (
           
    <Container text>
   
    <Button icon='upload' content = 'Upload dataset (csv)' />
    <Button.Group>
    <Button>Load default basemap</Button>
    <Button.Or />
    <Button>Upload your own</Button>
    </Button.Group>
    <Divider></Divider>
    <Header size='medium'>Select latitude and longitude</Header>
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
        
        

    </Container>
            
            
          ): (<Container>
            <Dimmer active inverted>
              <Loader size='medium' inverted content='Loading' />
            </Dimmer>
          </Container>)
    
        
}

export default GeoDataLoad;

// <Geolocationprepmap7 data = {data} map = {map} />