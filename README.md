# react-leaflet-cluster

- [x] React-leaflet v3 support
- [x] Typescript support

React-leaflet-cluster is a plugin for react-leaflet. A wrapper component of Leaflet.markercluster. Ready to be integrated into your React.js application to create beautifully animated Marker Clustering functionality.

![](showcase.gif)


### Installation
`yarn add react-leaflet-cluster`

Or with npm:
`npm i react-leaflet-cluster`


#### Prerequisites
Make sure that you've installed react-leaflet and leaflet.
```json
"react": "16.x",
"leaflet": "1.7.x",
"react-leaflet": "3.0.x"
```

####  API
For more detailed guide and API see:
https://akursat.gitbook.io/marker-cluster/api

#### Usage

```tsx
import MarkerClusterGroup from 'react-leaflet-cluster'
import {MapContainer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {addressPoints} from './realworld'

const Demo = () => {
  return (
    <MapContainer
      style={{height: '500px'}}
      center={[38.9637, 35.2433]}
      zoom={6}
      scrollWheelZoom={true}
    >
      <MarkerClusterGroup
        chunkedLoading
      >
        {(addressPoints as AdressPoint).map((address, index) => (
          <Marker
            key={index}
            position={[address[0], address[1]]}
            title={address[2]}
            icon={customIcon}
          ></Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
```
