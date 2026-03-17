import React from 'react'
import {
  extendContext,
  createElementObject,
  createPathComponent,
  LeafletContextInterface,
} from '@react-leaflet/core'
import L, { LeafletMouseEventHandlerFn } from 'leaflet'
import 'leaflet.markercluster'
// CSS imports removed to prevent Next.js issues
// Users should import CSS separately:
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'

// Users should configure their own icon URLs as needed
// delete (L.Icon.Default as any).prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: new URL('./assets/marker-icon-2x.png', import.meta.url).href,
//   iconUrl: new URL('./assets/marker-icon.png', import.meta.url).href,
//   shadowUrl: new URL('./assets/marker-shadow.png', import.meta.url).href,
// })

type ClusterType = { [key in string]: any }

type ClusterEvents = {
  onClick?: LeafletMouseEventHandlerFn
  onDblClick?: LeafletMouseEventHandlerFn
  onMouseDown?: LeafletMouseEventHandlerFn
  onMouseUp?: LeafletMouseEventHandlerFn
  onMouseOver?: LeafletMouseEventHandlerFn
  onMouseOut?: LeafletMouseEventHandlerFn
  onContextMenu?: LeafletMouseEventHandlerFn
}

type MarkerClusterControl = L.MarkerClusterGroupOptions & {
  children: React.ReactNode
} & ClusterEvents

function getPropsAndEvents(props: MarkerClusterControl) {
  let clusterProps: ClusterType = {}
  let clusterEvents: ClusterType = {}
  const { children, ...rest } = props
  // Splitting props and events to different objects
  Object.entries(rest).forEach(([propName, prop]) => {
    if (propName.startsWith('on')) {
      clusterEvents = { ...clusterEvents, [propName]: prop }
    } else {
      clusterProps = { ...clusterProps, [propName]: prop }
    }
  })
  return { clusterProps, clusterEvents }
}

function createMarkerClusterGroup(props: MarkerClusterControl, context: LeafletContextInterface) {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props)
  const markerClusterGroup = new L.MarkerClusterGroup(clusterProps)
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
    markerClusterGroup.on(clusterEvent, callback)
  })

  // React-leaflet calls addLayer() per child <Marker> via useLayerLifecycle.
  // When the cluster group is on the map, each addLayer() triggers a full
  // recalculation — O(N²) for N markers. We buffer those calls and flush them
  // as a single addLayers()/removeLayers() on the next microtask — O(N).
  //
  // Before the group is on the map (this._map is null), the native addLayer
  // already accumulates into _needsClustering at O(1) per call and bulk-
  // processes them in onAdd, so we delegate to the prototype in that case.
  const proto = L.MarkerClusterGroup.prototype
  let addBuffer: L.Layer[] = []
  let removeBuffer: L.Layer[] = []
  let flushScheduled = false

  function flush() {
    flushScheduled = false

    // Deduplicate by counting net adds/removes per layer. A simple
    // presence check (layer in both buffers => no-op) would be wrong:
    // React StrictMode re-runs effects (add -> remove -> add), so the
    // same layer can appear more times in one buffer than the other.
    const netOps = new Map<L.Layer, number>()
    for (const l of addBuffer) netOps.set(l, (netOps.get(l) ?? 0) + 1)
    for (const l of removeBuffer) netOps.set(l, (netOps.get(l) ?? 0) - 1)

    const toAdd: L.Layer[] = []
    const toRemove: L.Layer[] = []
    for (const [layer, count] of netOps) {
      if (count > 0) toAdd.push(layer)
      else if (count < 0) toRemove.push(layer)
    }

    // Clear before calling bulk methods so that any re-entrant
    // addLayer/removeLayer lands in fresh buffers.
    removeBuffer = []
    addBuffer = []

    if (toRemove.length > 0) markerClusterGroup.removeLayers(toRemove)
    if (toAdd.length > 0) markerClusterGroup.addLayers(toAdd)
  }

  function scheduleFlush() {
    if (flushScheduled) return
    flushScheduled = true
    queueMicrotask(flush)
  }

  markerClusterGroup.addLayer = function (layer: L.Layer) {
    if (!this._map) return proto.addLayer.call(this, layer)
    addBuffer.push(layer)
    scheduleFlush()
    return this
  }

  markerClusterGroup.removeLayer = function (layer: L.Layer) {
    if (!this._map) return proto.removeLayer.call(this, layer)
    removeBuffer.push(layer)
    scheduleFlush()
    return this
  }

  // Drain pending buffers on clearLayers() so a subsequent flush doesn't
  // re-add layers the caller just cleared.
  const originalClearLayers = markerClusterGroup.clearLayers
  markerClusterGroup.clearLayers = function () {
    addBuffer = []
    removeBuffer = []
    return originalClearLayers.call(this)
  }

  // _moveChild calls removeLayer then addLayer on the same layer synchronously
  // to update its position. The buffer would deduplicate this to a no-op, so we
  // bypass it and call the prototype methods directly.
  ;(markerClusterGroup as any)._moveChild = function (
    layer: L.Layer,
    from: L.LatLng,
    to: L.LatLng,
  ) {
    ;(layer as any)._latlng = from
    proto.removeLayer.call(this, layer)
    ;(layer as any)._latlng = to
    proto.addLayer.call(this, layer)
  }

  return createElementObject(
    markerClusterGroup,
    extendContext(context, { layerContainer: markerClusterGroup }),
  )
}

const updateMarkerCluster = (
  instance: L.MarkerClusterGroup,
  props: MarkerClusterControl,
  prevProps: MarkerClusterControl,
) => {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props)
  const { clusterProps: prevClusterProps, clusterEvents: prevClusterEvents } =
    getPropsAndEvents(prevProps)

  // Update Options
  Object.keys(clusterProps).forEach((key) => {
    if (clusterProps[key] !== prevClusterProps[key]) {
      // eslint-disable-next-line
      // @ts-ignore
      instance.options[key] = clusterProps[key]
    }
  })

  // Update Events
  Object.entries(prevClusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
    instance.off(clusterEvent, callback)
  })

  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
    instance.on(clusterEvent, callback)
  })
}

const MarkerClusterGroup = createPathComponent<L.MarkerClusterGroup, MarkerClusterControl>(
  createMarkerClusterGroup,
  updateMarkerCluster,
)

export default MarkerClusterGroup
