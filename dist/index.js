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
  const proto = L.MarkerClusterGroup.prototype;
  let addBuffer = [];
  let removeBuffer = [];
  let flushScheduled = false;
  function flush() {
    flushScheduled = false;
    const netOps = /* @__PURE__ */ new Map();
    for (const l of addBuffer) netOps.set(l, (netOps.get(l) ?? 0) + 1);
    for (const l of removeBuffer) netOps.set(l, (netOps.get(l) ?? 0) - 1);
    const toAdd = [];
    const toRemove = [];
    for (const [layer, count] of netOps) {
      if (count > 0) toAdd.push(layer);
      else if (count < 0) toRemove.push(layer);
    }
    removeBuffer = [];
    addBuffer = [];
    if (toRemove.length > 0) markerClusterGroup.removeLayers(toRemove);
    if (toAdd.length > 0) markerClusterGroup.addLayers(toAdd);
  }
  function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    queueMicrotask(flush);
  }
  markerClusterGroup.addLayer = function(layer) {
    if (!this._map) return proto.addLayer.call(this, layer);
    addBuffer.push(layer);
    scheduleFlush();
    return this;
  };
  markerClusterGroup.removeLayer = function(layer) {
    if (!this._map) return proto.removeLayer.call(this, layer);
    removeBuffer.push(layer);
    scheduleFlush();
    return this;
  };
  const originalClearLayers = markerClusterGroup.clearLayers;
  markerClusterGroup.clearLayers = function() {
    addBuffer = [];
    removeBuffer = [];
    flushScheduled = false;
    return originalClearLayers.call(this);
  };
  markerClusterGroup._moveChild = function(layer, from, to) {
    ;
    layer._latlng = from;
    proto.removeLayer.call(this, layer);
    layer._latlng = to;
    proto.addLayer.call(this, layer);
  };
  return createElementObject(
    markerClusterGroup,
    extendContext(context, { layerContainer: markerClusterGroup })
  );
}
var updateMarkerCluster = (instance, props, prevProps) => {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props);
  const { clusterProps: prevClusterProps, clusterEvents: prevClusterEvents } = getPropsAndEvents(prevProps);
  Object.keys(clusterProps).forEach((key) => {
    if (clusterProps[key] !== prevClusterProps[key]) {
      instance.options[key] = clusterProps[key];
    }
  });
  Object.entries(prevClusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    instance.off(clusterEvent, callback);
  });
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    instance.on(clusterEvent, callback);
  });
};
var MarkerClusterGroup = createPathComponent(
  createMarkerClusterGroup,
  updateMarkerCluster
);
var index_default = MarkerClusterGroup;
export {
  index_default as default
};
