import React from 'react'
import { Responsive, Segment } from 'semantic-ui-react'

const MainResponsive = () => (
  <Segment.Group>
    <Responsive as={Segment}>I'm always visible by default</Responsive>
  </Segment.Group>
)

export default MainResponsive