import React from 'react';
import { Table, Button, Icon, Tab, Message, Divider, Form } from 'semantic-ui-react';


const GeoDataFrame = (props) => {

  const absentCoordinatesTable = [];
  const unmappableItemsTable = [];
  const neighborPointsTable = [];


  props.unmapTab.map(item => {
    unmappableItemsTable.push(<Table.Row>
      <Table.Cell>{item['ersatz_id']}</Table.Cell>
      <Table.Cell>{item['rawPOB']}</Table.Cell>
      <Table.Cell>{item['GCcleanPOBprec']}</Table.Cell>
    </Table.Row>)
  })

  props.absTab.map(item => {
    absentCoordinatesTable.push(<Table.Row>
      <Table.Cell>{item['ersatz_id']}</Table.Cell>
      <Table.Cell>{item['rawPOB']}</Table.Cell>
      <Table.Cell>{item['GCcleanPOBprec']}</Table.Cell>
    </Table.Row>)
  })

  if (props.neighborsTab !== null) {
    
    props.neighborsTab.map((item,index) => {
 
      if (index == 0) {
        neighborPointsTable.push(<Table.Row active>
          <Table.Cell>{props.fullData[item]['ersatz_id']}</Table.Cell>
          <Table.Cell>{props.fullData[item]['rawPOB']}</Table.Cell>
          <Table.Cell>{props.fullData[item]['GCcleanPOBprec']}</Table.Cell>
        </Table.Row> )
      }
      else {
        neighborPointsTable.push(<Table.Row>
          <Table.Cell>{props.fullData[item]['ersatz_id']}</Table.Cell>
          <Table.Cell>{props.fullData[item]['rawPOB']}</Table.Cell>
          <Table.Cell>{props.fullData[item]['GCcleanPOBprec']}</Table.Cell>
        </Table.Row> )
  
      }
    })

  }

    
    const panes = [
        {
          menuItem: 'Neighbour points exploration',
          render: () => 
          <Tab.Pane attached={false}>
          {neighborPointsTable.length ==0 && <Message>Click on a point to display neighbour points list</Message>}
          
          {neighborPointsTable.length >0 && 
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
           {neighborPointsTable}
          </Table.Body>
          </Table></>}
        </Tab.Pane>,
        },
        {
          menuItem: 'Filter dataframe',
          render: () => 
          <Tab.Pane attached={false}>
          {neighborPointsTable.length ==0 &&
            <Form>
            <p>Select column and value to display related points on the map.</p>
            <Form.Select width={1} placeholder='Select a column' />
            <Form.Select width={1} placeholder='Select a value' />
            </Form>
          }
          
          {neighborPointsTable.length >0 && 
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
           {neighborPointsTable}
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
          {unmappableItemsTable}
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
        {absentCoordinatesTable}
        </Table.Body>
      </Table>
       </Tab.Pane>,
        },
      ]

return(
    <>
    <Divider></Divider>
    <Message>Use the tabs below to view and edit your dataframe.</Message>
    <Tab menu={{ pointing: true }} panes={panes} />

    </>
)


}

export default GeoDataFrame;
