import React, { useState } from 'react';
import { Menu, Accordion, Form, Dropdown, Radio} from 'semantic-ui-react'


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

      const catSettings = (
        <Form>
          <p>Create categories from a column</p>
          <Dropdown clearable fluid placeholder='Select a column' search selection zoomevt = {props.zoomLevel} options={colOptions} onChange={props.colOptions}/>
          
        </Form>
      )
      
      const tooltipSettings = (
        <Form>
          <p>Select up to 3 fields to display in tooltip.</p>
          <Form.Group grouped>
          <Form.Select fluid placeholder='Tooltip field 1' />
          <Form.Select fluid placeholder='Tooltip field 2' />
          <Form.Select fluid placeholder='Tooltip field 3' />
          </ Form.Group >
        </Form>
      )
    
      const neighborSettings = (
        <Form>
          <p>Select search radius to display neighbor points </p>
          <Form.Group grouped>
          <Form.Radio label='Small' name='size' type='radio' value='small' />
          <Form.Radio label='Medium' name='size' type='radio' value='medium' />
          <Form.Radio label='Large' name='size' type='radio' value='large' />
          </Form.Group>
        </Form>
      )

     /* const formItems = () {
        props.catList.map(item => {

        })
      } */

    
      const overlappingSettings = (
        <>
        <Form>
          <Form.Group grouped>
            <Form.Radio label='Darker color to render points density' name='color' type='radio' value={['color',props.zoomLevel]} checked = {props.colorStatus === 'color'} onChange={props.colorChange}/>
            
            <Form.Radio label='Homogoneous color display' name='color' type='radio' value={['single',props.zoomLevel]}  checked = {props.colorStatus === 'single'} onChange = {props.colorChange}/>
          </Form.Group>
          </Form>

            { /*
            
            props.catList.length > 0 && 
          
          <Form>

           
            <Form.Field>
              <Radio
                label='Or that'
                name='radioGroup'
                value='that'
                checked={this.state.value === 'that'}
                onChange={this.handleChange}
              />
            </Form.Field>
            </Form> */
            }
          </>  
      )


    return (

        <Accordion as={Menu} vertical>
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
          <Accordion.Content active={activeIndex === 0} content={tooltipSettings} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 1}
            content='Neighbor points'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1} content={neighborSettings} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 2}
            content='Categorical'
            index={2}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2} content={catSettings} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 3}
            content='Overlapping points'
            index={3}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 3} content={overlappingSettings} />
        </Menu.Item>
      </Accordion>
    )
}

export default GeoMapAccordion;