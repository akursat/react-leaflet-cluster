import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from '../../../src'
import { addressPoints } from '../realworld'
import 'leaflet/dist/leaflet.css'
type AdressPoint = Array<[number, number, string]>

export const Example2 = () => {
  return (
    <div>
      <h1>10.000 marker</h1>
      <MapContainer
        style={{ height: '500px' }}
        center={[-41.975762, 172.934298]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {(addressPoints as AdressPoint).map((address, index) => (
            <Marker key={index} position={[address[0], address[1]]} title={address[2]}></Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
