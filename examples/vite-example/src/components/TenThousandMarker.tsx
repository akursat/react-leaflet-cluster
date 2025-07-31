import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

// Mock data for 10,000 markers
const generateAddressPoints = () => {
  const points = []
  for (let i = 0; i < 10000; i++) {
    points.push([
      -41.975762 + (Math.random() - 0.5) * 20, // latitude
      172.934298 + (Math.random() - 0.5) * 20, // longitude
      `Marker ${i + 1}`, // title
    ])
  }
  return points
}

const addressPoints = generateAddressPoints()
type AddressPoint = Array<[number, number, string]>

export default function TenThousandMarker() {
  return (
    <div>
      <h2>10,000 Markers Example</h2>
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
          {(addressPoints as AddressPoint).map((address, index) => (
            <Marker key={index} position={[address[0], address[1]]} title={address[2]} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
