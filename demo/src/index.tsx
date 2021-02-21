import React from 'react'
import { render } from 'react-dom'
import 'leaflet/dist/leaflet.css'
import { Example1, Example2 } from './examples'

const Demo = () => {
  return (
    <div>
      <h1>react-leaflet-cluster examples</h1>
      <Example1 />
      <Example2 />
    </div>
  )
}

export default Demo

render(<Demo />, document.querySelector('#demo'))
