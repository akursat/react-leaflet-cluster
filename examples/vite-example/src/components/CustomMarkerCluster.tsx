import { useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import './CustomMarkerCluster.css'

const customIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDciIHZpZXdCb3g9IjAgMCA0MCA0NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDBDOC45NTQzMSAwIDAgOC45NTQzMSAwIDIwQzAgMzEuMDQ1NyA4Ljk1NDMxIDQwIDIwIDQwQzMxLjA0NTcgNDAgNDAgMzEuMDQ1NyA0MCAyMEM0MCA4Ljk1NDMxIDMxLjA0NTcgMCAyMCAwWiIgZmlsbD0iIzAwNzNGQSIvPgo8cGF0aCBkPSJNMjAgNkMxMi4yNjg5IDYgNiAxMi4yNjg5IDYgMjBDNiAyNy43MzExIDEyLjI2ODkgMzQgMjAgMzRDMjcuNzMxMSAzNCAzNCAyNy43MzExIDM0IDIwQzM0IDEyLjI2ODkgMjcuNzMxMSA2IDIwIDZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
  iconSize: new L.Point(40, 47),
})

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(33, 33, true),
  })
}

export default function CustomMarkerCluster() {
  const [dynamicPosition, setPosition] = useState<L.LatLngExpression>([41.051687, 28.987261])

  return (
    <div>
      <h2>Custom Marker Cluster Example</h2>
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
          iconCreateFunction={createClusterCustomIcon as any}
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
