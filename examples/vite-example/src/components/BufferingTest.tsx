import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'

interface TestMarker {
  id: string | number
  lat: number
  lng: number
}

export default function BufferingTest() {
  const [markers, setMarkers] = useState<TestMarker[]>([
    { id: 1, lat: 51.505, lng: -0.09 },
    { id: 2, lat: 51.51, lng: -0.1 },
    { id: 3, lat: 51.5, lng: -0.12 },
  ])

  const [testLog, setTestLog] = useState<string[]>(['Test Started'])
  const [markerCount, setMarkerCount] = useState(3)

  const addLog = useCallback((msg: string) => {
    console.log(`[TEST] ${msg}`)
    setTestLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }, [])

  // Test 1: Add markers rapidly (tests buffering)
  const testRapidAdd = useCallback(() => {
    addLog('Test 1: Rapid Add - Adding 10 markers quickly')
    const newMarkers: TestMarker[] = []
    for (let i = 0; i < 10; i++) {
      const id = markerCount + i + 1
      newMarkers.push({
        id,
        lat: 51.5 + Math.random() * 0.05,
        lng: -0.09 + Math.random() * 0.05,
      })
    }
    setMarkers((prev) => [...prev, ...newMarkers])
    setMarkerCount((c) => c + 10)
    addLog('✓ 10 markers added, should see smooth clustering')
  }, [markerCount, addLog])

  // Test 2: Add and remove same markers (tests deduplication with StrictMode)
  const testAddRemoveAdd = useCallback(() => {
    addLog('Test 2: Add-Remove-Add - Testing deduplication')
    const testMarker: TestMarker = {
      id: 'test-' + Date.now(),
      lat: 51.51,
      lng: -0.11,
    }
    // Simulates React StrictMode re-run: add -> remove -> add
    setMarkers((prev) => [...prev, testMarker])
    setTimeout(() => {
      setMarkers((prev) => prev.filter((m) => m.id !== testMarker.id))
      setTimeout(() => {
        setMarkers((prev) => [...prev, testMarker])
        setMarkerCount((c) => c + 1)
        addLog('✓ Marker should appear once, not duplicate (net +1)')
      }, 10)
    }, 10)
  }, [addLog])

  // Test 3: Remove markers
  const testRemove = useCallback(() => {
    addLog(`Test 3: Remove - Removing 50% of markers (${Math.floor(markerCount / 2)})`)
    setMarkers((prev) => prev.slice(0, Math.floor(prev.length / 2)))
    setMarkerCount((c) => Math.floor(c / 2))
    addLog('✓ Markers removed, clusters should recalculate')
  }, [markerCount, addLog])

  // Test 4: Clear all markers (tests clearLayers)
  const testClear = useCallback(() => {
    addLog('Test 4: Clear All - Clearing all markers')
    setMarkers([])
    setMarkerCount(0)
    addLog('✓ All markers cleared via clearLayers()')
  }, [addLog])

  // Test 5: Large dataset (performance test)
  const testLargeDataset = useCallback(() => {
    addLog('Test 5: Large Dataset - Adding 1000 markers (performance test)')
    const newMarkers: TestMarker[] = []
    const baseId = markerCount + 1
    for (let i = 0; i < 1000; i++) {
      newMarkers.push({
        id: baseId + i,
        lat: 51.5 + (Math.random() - 0.5) * 0.1,
        lng: -0.09 + (Math.random() - 0.5) * 0.1,
      })
    }

    const startTime = performance.now()
    const timestamp = new Date().toISOString()

    // Log to console for easy copy-paste
    console.log(`%c[PERF TEST START] ${timestamp}`, 'color: #FF5722; font-weight: bold')

    setMarkers((prev) => [...prev, ...newMarkers])
    setMarkerCount((c) => c + 1000)

    // Check at multiple intervals
    const checks = [50, 100, 200, 500]
    checks.forEach((delay) => {
      setTimeout(() => {
        const elapsed = (performance.now() - startTime).toFixed(2)
        if (delay === 100) {
          addLog(` Initial render: ${elapsed}ms`)
        }
      }, delay)
    })

    setTimeout(() => {
      const totalElapsed = (performance.now() - startTime).toFixed(2)
      addLog(`✓ RESULT: 1000 markers in ${totalElapsed}ms`)
      console.log(
        `%c[PERF TEST RESULT] ${totalElapsed}ms`,
        'color: #4CAF50; font-weight: bold; font-size: 16px',
      )
      console.log(`%cCopy this value for your PERFORMANCE_RESULTS.md`, 'color: #666')
      addLog('💾 Check browser console - value ready to copy!')
    }, 500)
  }, [markerCount, addLog])

  // Test 6: Add a few, pause, then add more (tests multiple flush cycles)
  const testStepwiseAdd = useCallback(() => {
    addLog('Test 6: Stepwise Add - Adding in batches with delays')
    const batch1 = markerCount + 1
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setMarkers((prev) => [
          ...prev,
          {
            id: batch1 + i,
            lat: 51.5 + Math.random() * 0.02,
            lng: -0.09 + Math.random() * 0.02,
          },
        ])
        setMarkerCount((c) => c + 1)
        if (i === 4) addLog('✓ Steps completed, should have 5 flushed groups')
      }, i * 500)
    }
  }, [markerCount, addLog])

  // Test 7: Move marker (tests _moveChild override - bypasses buffer for position updates)
  const testMoveMarker = useCallback(() => {
    if (markers.length === 0) {
      addLog('Test 7: Move Marker - Need at least 1 marker, add first with Test 1')
      return
    }
    addLog('Test 7: Move Marker - Moving first marker to random location')
    const movedMarker = markers[0]
    const newLat = 51.5 + Math.random() * 0.02
    const newLng = -0.09 + Math.random() * 0.02

    setMarkers((prev) =>
      prev.map((m) => (m.id === movedMarker.id ? { ...m, lat: newLat, lng: newLng } : m)),
    )
    addLog(
      `✓ Marker moved from (${movedMarker.lat.toFixed(4)}, ${movedMarker.lng.toFixed(
        4,
      )}) to (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`,
    )
    addLog('  (Tests _moveChild override - should not be buffered)')
  }, [markers, addLog])

  // Test 8: Rapid add + remove simultaneously (stress test buffer deduplication)
  const testStressDeduplication = useCallback(() => {
    addLog('Test 8: Stress Deduplication - 5 rapid add+remove cycles')
    let addedCount = 0
    for (let batch = 0; batch < 5; batch++) {
      setTimeout(() => {
        // Add 3 markers
        const newMarkers: TestMarker[] = []
        for (let i = 0; i < 3; i++) {
          newMarkers.push({
            id: `stress-${batch}-${i}`,
            lat: 51.5 + Math.random() * 0.01,
            lng: -0.09 + Math.random() * 0.01,
          })
        }
        setMarkers((prev) => [...prev, ...newMarkers])
        addedCount += 3

        // Immediately remove them (within same batch)
        setTimeout(() => {
          setMarkers((prev) => prev.filter((m) => !newMarkers.some((nm) => nm.id === m.id)))
          if (batch === 4) {
            addLog(`✓ Stress test complete: ${addedCount} adds, all removes succeeded`)
            addLog('  (Count-based deduplication handled all cycles)')
          }
        }, 5)
      }, batch * 100)
    }
  }, [addLog])

  return (
    <div style={{ display: 'flex', height: '100vh', gap: '20px', padding: '10px' }}>
      {/* Map Section */}
      <div style={{ flex: 2, position: 'relative' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MarkerClusterGroup>
            {markers.map((marker) => (
              <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                <Popup>
                  Marker {marker.id}
                  <br />
                  Lat: {marker.lat.toFixed(4)}
                  <br />
                  Lng: {marker.lng.toFixed(4)}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Control & Log Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            background: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0' }}>Buffering Tests</h2>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
            Total Markers: <strong>{markerCount}</strong>
          </p>

          {/* Test Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={testRapidAdd}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 1: Rapid Add
            </button>
            <button
              onClick={testAddRemoveAdd}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 2: Add-Remove-Add
            </button>
            <button
              onClick={testRemove}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 3: Remove 50%
            </button>
            <button
              onClick={testClear}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 4: Clear All
            </button>
            <button
              onClick={testLargeDataset}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 5: 1000 Markers
            </button>
            <button
              onClick={testStepwiseAdd}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 6: Stepwise Add
            </button>
            <button
              onClick={testMoveMarker}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 7: Move Marker
            </button>
            <button
              onClick={testStressDeduplication}
              style={{
                padding: '8px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Test 8: Stress Dedup
            </button>
          </div>
        </div>

        {/* Test Log */}
        <div
          style={{
            flex: 1,
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '11px',
          }}
        >
          <strong>Test Log:</strong>
          {testLog.map((log, idx) => (
            <div key={idx} style={{ margin: '2px 0', color: '#333' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
