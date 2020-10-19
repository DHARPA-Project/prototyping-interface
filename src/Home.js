
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
    <Container style={{width: "80%", paddingTop: "5%"}}>
        <Grid columns={2} >
        <Grid.Column>
        <Header size='medium'>Select a worflow</Header>
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
       
        <Grid.Column>
        <Header size='medium'>What do your data look like ?</Header>
        <Card.Group itemsPerRow={3}>
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