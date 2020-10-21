import React from 'react';
import { Table } from 'semantic-ui-react'


const TableUnmappable = (props) => (

    <Table celled collapsing>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Missing coordinates</Table.Cell>
          <Table.Cell>
            {chartLegend[0].absentCoordinates}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Not mappable</Table.Cell>
          <Table.Cell>
          {chartLegend[0].unmappable}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell>
          {chartLegend[0].total}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
    
  )

  export default TableUnmappable;
