import React, { useState } from 'react';
import { Form, Radio, Divider, Table, Button } from 'semantic-ui-react'

const GeoMapCategories = (props) => {
    
    const [activeItem, setActiveItem] = useState('all')

    const  handleChange = (e, { value }) => {
      setActiveItem(value);
      props.displayCategory(props.zoomLevel,value);
    }



 

    const listItems = props.catList.map((item,index) => {
        return(
            <Table.Row>
            <Table.Cell> <Radio fitted
              name={item[0]}
              value={item[0]}
              checked={activeItem === item[0]}
              onChange={handleChange}
            /></Table.Cell>
        <Table.Cell><span style={{borderBottom: `${item[2]} solid 2px`}}> {item[0]}</span></Table.Cell>
        <Table.Cell> {item[1]} </Table.Cell>
            </Table.Row>
          )
    })


    console.log(props.maxCatReached)

  
    return props.catList.length > 0 && (
    <>
        <Divider hidden />
        <Form>
        <Table basic='very' collapsed  compact>
        <Table.Body>
        {listItems}
        <Table.Row>
        <Table.Cell> <Radio 
          name='all'
          value='all'
          checked={activeItem === 'all'}
          onChange={handleChange}
        /></Table.Cell>
        <Table.Cell>Show all</Table.Cell>
        <Table.Cell></Table.Cell>
        </Table.Row>

        </Table.Body>
        </Table>
        </Form>
        <Divider hidden />
      </>
      )
  }

  export default GeoMapCategories;