// src/index.tsx
import {
  extendContext,
  createElementObject,
  createPathComponent
} from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.markercluster";
function getPropsAndEvents(props) {
  let clusterProps = {};
  let clusterEvents = {};
  const { children, ...rest } = props;
  Object.entries(rest).forEach(([propName, prop]) => {
    if (propName.startsWith("on")) {
      clusterEvents = { ...clusterEvents, [propName]: prop };
    } else {
      clusterProps = { ...clusterProps, [propName]: prop };
    }
  });
  return { clusterProps, clusterEvents };
}
function createMarkerClusterGroup(props, context) {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props);
  const markerClusterGroup = new L.MarkerClusterGroup(clusterProps);
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    markerClusterGroup.on(clusterEvent, callback);
  });
  return createElementObject(
    markerClusterGroup,
    extendContext(context, { layerContainer: markerClusterGroup })
  );
}
var updateMarkerCluster = (instance, props, prevProps) => {
};
var MarkerClusterGroup = createPathComponent(
  createMarkerClusterGroup,
  updateMarkerCluster
);
var index_default = MarkerClusterGroup;
export {
  index_default as default
};
