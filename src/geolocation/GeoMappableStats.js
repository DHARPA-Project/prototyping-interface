import React from 'react';
import { Table } from 'semantic-ui-react'


const TableUnmappable = (props) => (
    <Table celled collapsing>
      <Table.Body>
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
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell>
            {props.unmap[2]}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
    
  )

  export default TableUnmappable;
