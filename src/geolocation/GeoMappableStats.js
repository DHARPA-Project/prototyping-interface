import React from 'react';
import { Table } from 'semantic-ui-react'


const TableUnmappable = (props) => (
    <Table collapsing>
      <Table.Body>
      <Table.Row>
          <Table.Cell>Mappable</Table.Cell>
          <Table.Cell>
            {props.unmap[2] - props.unmap[0] - props.unmap[1]}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Missing coordinates</Table.Cell>
          <Table.Cell>
            {props.unmap[0]}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Not mappable</Table.Cell>
          <Table.Cell>
            {props.unmap[1]}
          </Table.Cell>
        </Table.Row>
        </Table.Body>
        <Table.Footer>
        <Table.Row>
          <Table.HeaderCell>Total</Table.HeaderCell>
          <Table.HeaderCell>
            {props.unmap[2]}
          </Table.HeaderCell>
        </Table.Row>
        </Table.Footer>
    </Table>
    
  )

  export default TableUnmappable;
