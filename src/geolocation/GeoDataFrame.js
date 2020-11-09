import React from 'react';
import { Table, Button, Icon, Tab, Message, Divider } from 'semantic-ui-react';


const GeoDataFrame = (props) => {

    
    const panes = [
        {
          menuItem: 'Neighbour points exploration',
          render: () => 
          <Tab.Pane attached={false}>
          <Message>Click on a point to display neighbour points list</Message>
          {props.tableRes != null && 
          <>
          <Button basic icon labelPosition='left'>
              <Icon name='edit' />
                  Edit
              </Button>
              <Button basic icon labelPosition='left'>
              <Icon name='save' />
                  Save Output
              </Button>
          <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ersatz_id</Table.HeaderCell>
              <Table.HeaderCell>rawPOB</Table.HeaderCell>
              <Table.HeaderCell>GCcleanPOBprec</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
           {props.tableRes}
          </Table.Body>
          </Table></>}
        </Tab.Pane>,
        },
        {
          menuItem: 'Unmappable',
          render: () => <Tab.Pane attached={false}>
           <Button basic icon labelPosition='left'>
        <Icon name='edit' />
          Edit
        </Button>
      <Button basic icon labelPosition='left'>
        <Icon name='save' />
          Save Output
        </Button>
           <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ersatz_id</Table.HeaderCell>
              <Table.HeaderCell>rawPOB</Table.HeaderCell>
              <Table.HeaderCell>GCcleanPOBprec</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {props.unmapTab}
          </Table.Body>
        </Table> 
    
          </Tab.Pane>,
        },
        {
          menuItem: 'Missing coordinates',
          render: () => <Tab.Pane attached={false}>
              <Button basic icon labelPosition='left'>
        <Icon name='edit' />
          Edit
        </Button>
      <Button basic icon labelPosition='left'>
        <Icon name='save' />
          Save Output
        </Button>
              <Table striped><Table.Header>
          <Table.Row>
            <Table.HeaderCell>ersatz_id</Table.HeaderCell>
            <Table.HeaderCell>rawPOB</Table.HeaderCell>
            <Table.HeaderCell>GCcleanPOBprec</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {props.absTab}
        </Table.Body>
      </Table>
       </Tab.Pane>,
        },
      ]

return(
    <>
    <Divider></Divider>
    <Tab menu={{ pointing: true }} panes={panes} />

    </>
)


}

export default GeoDataFrame;