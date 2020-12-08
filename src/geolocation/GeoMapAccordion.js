import React, { useState } from 'react';
import { Menu, Accordion, Form, Dropdown, Radio} from 'semantic-ui-react'
import GeoMapCategories from './GeoMapCategories';


const GeoMapAccordion = (props) => {

    const [activeIndex, setActiveIndex] = useState(null);
    const [radiusLevel, setRadiusLevel] = useState('medium');

    let handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
      }

    const colOptions = [];

    props.cols.map((item,index) => {
        colOptions.push({key: index, text: item, value: item})
      })

    let radiusChange = (e,{value}) => {
      setRadiusLevel(value);
      props.neighbSizeChange(value);
    }


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
          <Form.Select fluid placeholder='Tooltip field 1' options={colOptions} onChange = {props.tooltipCols} id='1'/>
          <Form.Select fluid placeholder='Tooltip field 2' options={colOptions} onChange = {props.tooltipCols} id ='2'/>
          <Form.Select fluid placeholder='Tooltip field 3' options={colOptions} onChange = {props.tooltipCols} id = '3'/>
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
              <Form.Radio label='Small' type='radio' value='small' checked={radiusLevel === 'small'} onChange={radiusChange} />
              <Form.Radio label='Medium' type='radio' value='medium' checked={radiusLevel === 'medium'} onChange={radiusChange} />
              <Form.Radio label='Large' type='radio' value='large' checked={radiusLevel === 'large'} onChange={radiusChange} />
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

