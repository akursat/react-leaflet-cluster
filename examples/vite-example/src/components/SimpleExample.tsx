import React, { useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

export default function SimpleExample() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>Simple Example</h2>
      <MapContainer style={{ height: '80vh' }} center={[43.0, 32.0]} zoom={4} maxZoom={18}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup>
          <Marker position={[39.3397, 27.0597]} />
          <Marker position={[42.2277, 25.0122]} />
          <Marker position={[41.5044, -0.0101]} />
        </MarkerClusterGroup>
      </MapContainer>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </div>
  )
}
