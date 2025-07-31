# react-leaflet-cluster [![npm version](https://img.shields.io/npm/v/react-leaflet-cluster.svg)](https://www.npmjs.com/package/react-leaflet-cluster)
- [x] React 19 support
- [x] React-leaflet v4 support
- [x] Typescript support
- [x] Next.js compatibility

## Breaking Changes in v3.0.0

**CSS imports are now required manually** - The package no longer automatically imports CSS files to prevent Next.js build issues. You must now import the CSS files separately:

```tsx
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
```

React-leaflet-cluster is a plugin for react-leaflet. A wrapper component of Leaflet.markercluster. Ready to be integrated into your React.js application to create beautifully animated Marker Clustering functionality.

![](showcase.gif)

### Examples - Code Sandbox

- [10.000 marker](https://codesandbox.io/s/hidden-breeze-nrd3e?fontsize=14&hidenavigation=1&theme=dark)
- [Custom marker cluster](https://codesandbox.io/s/beautiful-pike-j2l0w?file=/src/App.tsx)

### Installation

`yarn add react-leaflet-cluster`

Or with npm:
`npm i react-leaflet-cluster`

#### Prerequisites

Make sure that you've installed react-leaflet and leaflet.

```json
"react": "18.x",
"leaflet": "1.8.x",
"react-leaflet": "4.0.x"
```

#### CSS Import

The package requires CSS files to be imported for proper styling. Add these imports to your main component or entry file:

```tsx
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
```

**Note for Next.js users**: These CSS imports are required and should be added to your component or a global CSS file. The package no longer automatically imports CSS to prevent Next.js build issues.

#### Icon Configuration

The package no longer automatically configures Leaflet's default marker icons. If you need to use default markers, you'll need to configure the icon URLs yourself. Add this configuration to your component or entry file:

```tsx
import L from 'leaflet'

// Configure default marker icons
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
```

Alternatively, you can use your own custom icons for markers:

```tsx
import L from 'leaflet'

const customIcon = new L.Icon({
  iconUrl: '/path/to/your/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/path/to/your/marker-shadow.png',
  shadowSize: [41, 41],
})
```

#### Migration from v2.x

If you're upgrading from v2.x, you need to add the CSS imports manually. The package will work without them, but the clustering won't be styled properly.

**Before (v2.x):**

```tsx
import MarkerClusterGroup from 'react-leaflet-cluster'
// CSS was automatically imported
```

**After (v3.1.0):**

```tsx
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
```

#### API

For more detailed guide and API see:
https://akursat.gitbook.io/marker-cluster/api

#### Usage

```tsx
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// Import the required CSS for marker clustering
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import { addressPoints } from './realworld'

const Demo = () => {
  return (
    <MapContainer
      style={{ height: '500px' }}
      center={[38.9637, 35.2433]}
      zoom={6}
      scrollWheelZoom={true}
    >
      <MarkerClusterGroup chunkedLoading>
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
