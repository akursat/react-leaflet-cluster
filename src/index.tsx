import { createPathComponent, LeafletContextInterface } from '@react-leaflet/core'
import L, { LeafletMouseEventHandlerFn } from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import React, { useEffect } from 'react'

//webpack failing when loading leaflet marker icon
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
})

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
  return [clusterProps, clusterEvents]
}

function createMarkerCluster(props: MarkerClusterControl, context: LeafletContextInterface) {
  const [clusterProps, clusterEvents] = getPropsAndEvents(props)
  const clusterGroup = new L.MarkerClusterGroup(clusterProps)

  useEffect(() => {
    Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
      const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
      clusterGroup.on(clusterEvent, callback)
    })
    return () => {
      Object.entries(clusterEvents).forEach(([eventAsProp]) => {
        const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
        clusterGroup.removeEventListener(clusterEvent)
      })
    }
  }, [clusterEvents, clusterGroup])

  return {
    instance: clusterGroup,
    context: { ...context, layerContainer: clusterGroup },
  }
}

const updateMarkerCluster = (
  instance: L.MarkerClusterGroup,
  props: MarkerClusterControl,
  prevProps: MarkerClusterControl,
) => {
  //TODO when prop change update instance
  if (props.showCoverageOnHover !== prevProps.showCoverageOnHover) {
  }
}

const MarkerClusterGroup = createPathComponent<L.MarkerClusterGroup, MarkerClusterControl>(
  createMarkerCluster,
  updateMarkerCluster,
)

export default MarkerClusterGroup
