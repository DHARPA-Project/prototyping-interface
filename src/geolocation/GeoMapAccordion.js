import React, { useState } from 'react';
import { Menu, Accordion, Form, Select} from 'semantic-ui-react'


const catSettings = (
    <Form>
      <p>Create categories from a column</p>
        <Form.Select fluid placeholder='Select a column' name='color' value='red' />
    </Form>
  )

  const filterSettings = (
    <Form>
      <p>Filter data</p>
      <Form.Group grouped>
      <Form.Select fluid placeholder='1. Select column' />
      <Form.Select fluid placeholder='2. Select value' />
      </Form.Group>
    </Form>
  )
  
  const mouseSettings = (
    <Form>
      <p>Hover / Tooltip settings <br/> Select up to 3 fields to display in tooltip. </p>
      <Form.Group grouped>
      <Form.Select fluid placeholder='Tooltip field 1' />
      <Form.Select fluid placeholder='Tooltip field 2' />
      <Form.Select fluid placeholder='Tooltip field 3' />
      </Form.Group>
      <p>Click / radius settings <br/> Select search radius to display neighbor points </p>
      <Form.Group grouped>
      <Form.Radio label='Small' name='size' type='radio' value='small' />
      <Form.Radio label='Medium' name='size' type='radio' value='medium' />
      <Form.Radio label='Large' name='size' type='radio' value='large' />
      </Form.Group>
    </Form>
  )

  const overlappingSettings = (
    <Form>
      <Form.Group grouped>
        <Form.Radio label='Darker color to render points density' name='color' type='radio' value='color' />
        <Form.Radio label='Homogoneous color display' name='color' type='radio' value='single' defaultChecked/>
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
            content='Mouse events'
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0} content={mouseSettings} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 1}
            content='Categorical'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1} content={catSettings} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 2}
            content='Filter'
            index={2}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2} content={filterSettings} />
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