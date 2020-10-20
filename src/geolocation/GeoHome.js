
import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Table, Checkbox, Button, Container, Divider } from 'semantic-ui-react'


const GeoHome = () => (
<Container>
<Header size='large'>Geolocation</Header>
<Button icon='download' content = 'Research process notice' />
<Button icon='download' content = 'Tutorial' />
<Divider></Divider>

<Table celled compact definition>
    <Table.Header fullWidth>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell>Process</Table.HeaderCell>
        <Table.HeaderCell>Description</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell collapsing>
          <Checkbox toggle defaultChecked/>
        </Table.Cell>
        <Table.Cell>Preparation</Table.Cell>
        <Table.Cell>Default mapping of imported or created geographical data.</Table.Cell>
      </Table.Row>
     
    </Table.Body>

    <Table.Footer fullWidth>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell colSpan='2'>
        <Link to='/geolocation-prep'>
          <Button
            floated='right'
            icon
            labelPosition='left'
            primary
            size='small'
          >
            Start
          </Button>
          </Link>
          </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
        
  </Container>

  );
  
  export default GeoHome;