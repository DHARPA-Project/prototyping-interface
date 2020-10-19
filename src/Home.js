
import React from 'react';
import { Divider, Grid, Segment, Container, Header, Card } from 'semantic-ui-react'


const items = [
    {
      header: 'Topic Modelling',
      description:
        'Using statistical modelling to discover topics in a textual collection.',
      meta: 'NLP',
      href: 'topic-modelling'
    },
    {
      header: 'Geolocation',
      description:
        'Methods of geolocation which can be implemented iteratively to produce standardized coordinate data',
      meta: 'Geolocation',
      href: 'geolocation'
    }

  ]

  const dataTypes = [
    {
      header: 'Tabular data',
      description: 'Create your own worflow from CSV files',
      meta: 'csv'
    },
    {
      header: 'Text',
      description: 'Create your own worflow from TXT files',
      meta: 'txt'
    },
    {
      header: 'Images',
      description: 'Create your own worflow from any images format',
      meta: 'jpg'
    },
    {
      header: 'Audio',
      description: 'Create your own worflow from any images format',
      meta: 'mp3'
    }

  ]


const Home = () => (
    <>
      <Container style={{width: "80%", paddingTop: "5%", maxHeight: "700px"}}>
        <Grid columns={2} >
        <Grid.Column style = {{paddingRight: "7%"}}>
        <Header size='medium'>Select a worflow</Header>
        <Divider />
        <p>Use one of our workflows to follow a step-by-step guided process to turn your data into powerful analysis and visualizations.</p>
        <Card.Group itemsPerRow={2}>
          { items.map( (item,index) =>  <Card
                key = {`home-${index}}`}
                header= { item.header }
                meta= { item.meta }
                description= { item.description }
                href={item.href}
                /> ) }
        </Card.Group>
        </Grid.Column>
       
        <Grid.Column style = {{paddingLeft: "7%"}}>
        <Header size='medium'>What do your data look like ?</Header>
        <Divider />
        <p>Create your own data process by accessing the functionalities across different workflows.</p>
        
        <Card.Group itemsPerRow={2}>
          { dataTypes.map( (item,index) =>  <Card
                key = {`home-${index}}`}
                header= { item.header }
                meta= { item.meta }
                description= { item.description }
                href={item.href}
                /> ) }
        </Card.Group>
        </Grid.Column>
        </Grid>
    <Divider vertical>Or</Divider>
    </Container>
    </>
  );
  
  export default Home;