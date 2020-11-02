import React, { useState } from 'react';
import { Menu, Accordion, Form, Container } from 'semantic-ui-react'


const ColorForm = (
    <Form>
      <Form.Group grouped>
        <Form.Checkbox label='Red' name='color' value='red' />
        <Form.Checkbox label='Orange' name='color' value='orange' />
        <Form.Checkbox label='Green' name='color' value='green' />
        <Form.Checkbox label='Blue' name='color' value='blue' />
      </Form.Group>
    </Form>
  )
  
  const SizeForm = (
    <Form>
      <Form.Group grouped>
        <Form.Radio label='Small' name='size' type='radio' value='small' />
        <Form.Radio label='Medium' name='size' type='radio' value='medium' />
        <Form.Radio label='Large' name='size' type='radio' value='large' />
        <Form.Radio label='X-Large' name='size' type='radio' value='x-large' />
      </Form.Group>
    </Form>
  )

const GeoMapAccordion = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    let handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
      }


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
          <Accordion.Content active={activeIndex === 0} content={SizeForm} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 1}
            content='Neighbours'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1} content={ColorForm} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 2}
            content='Categorized'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2} content={ColorForm} />
        </Menu.Item>
      </Accordion>


    )


}

export default GeoMapAccordion;