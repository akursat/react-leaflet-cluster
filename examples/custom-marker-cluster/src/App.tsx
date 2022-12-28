import React, { useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L, { MarkerCluster } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import './App.css'
import 'leaflet/dist/leaflet.css'

const customIcon = new L.Icon({
  iconUrl: require('./location.svg').default,
  iconSize: new L.Point(40, 47),
})

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return new L.DivIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(33, 33, true),
  })
}

function App() {
  const [dynamicPosition, setPosition] = useState<L.LatLngExpression>([41.051687, 28.987261])

  return (
    <div>
      <h1>Custom Marker Cluster</h1>
      <button
        onClick={() => {
          setPosition([40.051687, 28.987261])
        }}
      >
        Rerender Marker
      </button>
      <MapContainer
        style={{ height: '500px' }}
        center={[36.668754, 35.2433]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          onClick={(e: any) => console.log('onClick', e)}
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={150}
          spiderfyOnMaxZoom={true}
          polygonOptions={{
            fillColor: '#ffffff',
            color: '#f00800',
            weight: 5,
            opacity: 1,
            fillOpacity: 0.8,
          }}
          showCoverageOnHover={true}
        >
          <Marker position={[36.668754, 29.104185]} icon={customIcon} />
          <Marker position={[40.587613, 36.944535]} icon={customIcon} />
          <Marker position={[40.614681, 43.121517]} icon={customIcon} />
          <Marker position={[38.357641, 38.328708]} icon={customIcon} />
          <Marker position={dynamicPosition} title={'test'} />
          <Marker position={[39.931841, 32.876713]} icon={customIcon} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}

export default App
