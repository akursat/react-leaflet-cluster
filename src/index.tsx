import * as React from 'react'
import {
  extendContext,
  createElementObject,
  createPathComponent,
  LeafletContextInterface,
} from '@react-leaflet/core'
import * as L from 'leaflet'
import 'leaflet.markercluster'
import './assets/MarkerCluster.css'
import './assets/MarkerCluster.Default.css'

delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./assets/marker-icon-2x.png').default,
  iconUrl: require('./assets/marker-icon.png').default,
  shadowUrl: require('./assets/marker-shadow.png').default,
})

type ClusterType = { [key in string]: any }

type ClusterEvents = {
  onClick?: L.LeafletMouseEventHandlerFn
  onDblClick?: L.LeafletMouseEventHandlerFn
  onMouseDown?: L.LeafletMouseEventHandlerFn
  onMouseUp?: L.LeafletMouseEventHandlerFn
  onMouseOver?: L.LeafletMouseEventHandlerFn
  onMouseOut?: L.LeafletMouseEventHandlerFn
  onContextMenu?: L.LeafletMouseEventHandlerFn
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
  //TODO when prop change update instance
  //   if (props. !== prevProps.center || props.size !== prevProps.size) {
  //   instance.setBounds(getBounds(props))
  // }
}

const MarkerClusterGroup = createPathComponent<L.MarkerClusterGroup, MarkerClusterControl>(
  createMarkerClusterGroup,
  updateMarkerCluster,
)

export default MarkerClusterGroup
