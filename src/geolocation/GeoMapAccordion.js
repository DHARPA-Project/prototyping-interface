import React, { useState } from 'react';
import { Menu, Accordion, Form, Dropdown, Radio} from 'semantic-ui-react'
import GeoMapCategories from './GeoMapCategories';


const GeoMapAccordion = (props) => {

    const [activeIndex, setActiveIndex] = useState(null);

    let handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
      }

      const colOptions = [
        {
        key: 3,
        text: 'GCcleanPOBprec',
        value: 'GCcleanPOBprec'}
      ]



    return (

        <Accordion as={Menu} vertical>
        <Form>
        <Menu.Item>
        <p>How do you want to explore the data?</p> 
        </Menu.Item>
          
        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 0}
            content='Tooltip'
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0}>

          <p>Select up to 3 fields to display in tooltip.</p>
          <Form.Group grouped>
          <Form.Select fluid placeholder='ersatz_id' />
          <Form.Select fluid placeholder='rawPOB' />
          <Form.Select fluid placeholder='GCcleanPOBprec' />
          </ Form.Group >
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 1}
            content='Neighbor points'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1}>
 
            <p>Select search radius to display neighbor points </p>
            <Form.Group grouped>
            <Form.Radio label='Small' name='size' type='radio' value='small' />
            <Form.Radio label='Medium' name='size' type='radio' value='medium' checked/>
            <Form.Radio label='Large' name='size' type='radio' value='large' />
            </Form.Group>
  
          </Accordion.Content>
        </Menu.Item>
        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 2}
            content='Overlapping points'
            index={2}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2}>
            <Form.Group grouped>
              <Form.Radio label='Darker color to render points density' name='color' type='radio' value={['color',props.zoomLevel]} checked = {props.colorStatus === 'color'} onChange={props.colorChange}/>
              <Form.Radio label='Homogoneous color display' name='color' type='radio' value={['single',props.zoomLevel]}  checked = {props.colorStatus === 'single' } onChange = {props.colorChange}/>
              <Form.Radio label='Grouped points display' name='grouped' type='radio' value={['grouped',props.zoomLevel]}  checked = {props.colorStatus === 'grouped' } onChange = {props.colorChange}/>
            </Form.Group>
          
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 3}
            content='Categorical'
            index={3}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 3}>
           
              <p>Create categories from a column</p>
              <Dropdown clearable fluid placeholder='Select a column' search selection zoomevt = {props.zoomLevel} options={colOptions} onChange={props.colOptions}/>
    
            <GeoMapCategories catList = {props.catList} displayCategory = {props.displayCategory} zoomLevel = {props.zoomLevel} />
          </Accordion.Content>
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 4}
            content='Filter'
            index={4}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 4}>
          <p>Select column and value to display related points on the map.</p>
          <Form.Group grouped>
          <Form.Select fluid placeholder='Select column' />
          <Form.Select fluid placeholder='Select value' />
          </ Form.Group >
            </Accordion.Content>
        </Menu.Item>

       
        </Form>
      </Accordion>
    )
}

export default GeoMapAccordion;

