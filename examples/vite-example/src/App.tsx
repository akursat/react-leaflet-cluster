import React, { useState } from 'react'
import 'leaflet/dist/leaflet.css'
// Import the required CSS for marker clustering
import 'react-leaflet-cluster/es/assets/MarkerCluster.css'
import 'react-leaflet-cluster/es/assets/MarkerCluster.Default.css'

import SimpleExample from './components/SimpleExample'
import TenThousandMarker from './components/TenThousandMarker'
import CustomMarkerCluster from './components/CustomMarkerCluster'

type ExampleType = 'simple' | 'ten-thousand' | 'custom'

export default function App() {
  const [currentExample, setCurrentExample] = useState<ExampleType>('simple')

  const renderExample = () => {
    switch (currentExample) {
      case 'simple':
        return <SimpleExample />
      case 'ten-thousand':
        return <TenThousandMarker />
      case 'custom':
        return <CustomMarkerCluster />
      default:
        return <SimpleExample />
    }
  }

  return (
    <div>
      <h1>React Leaflet Cluster Examples</h1>

      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentExample('simple')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: currentExample === 'simple' ? '#007bff' : '#f8f9fa',
            color: currentExample === 'simple' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Simple Example
        </button>
        <button
          onClick={() => setCurrentExample('ten-thousand')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: currentExample === 'ten-thousand' ? '#007bff' : '#f8f9fa',
            color: currentExample === 'ten-thousand' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          10,000 Markers
        </button>
        <button
          onClick={() => setCurrentExample('custom')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentExample === 'custom' ? '#007bff' : '#f8f9fa',
            color: currentExample === 'custom' ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Custom Cluster
        </button>
      </nav>

      {renderExample()}
    </div>
  )
}
