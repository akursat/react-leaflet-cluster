import React from 'react';
import L, { LeafletMouseEventHandlerFn } from 'leaflet';
import 'leaflet.markercluster';
import './assets/MarkerCluster.css';
import './assets/MarkerCluster.Default.css';
declare type ClusterEvents = {
    onClick?: LeafletMouseEventHandlerFn;
    onDblClick?: LeafletMouseEventHandlerFn;
    onMouseDown?: LeafletMouseEventHandlerFn;
    onMouseUp?: LeafletMouseEventHandlerFn;
    onMouseOver?: LeafletMouseEventHandlerFn;
    onMouseOut?: LeafletMouseEventHandlerFn;
    onContextMenu?: LeafletMouseEventHandlerFn;
};
declare const MarkerClusterGroup: React.ForwardRefExoticComponent<L.MarkerClusterGroupOptions & {
    children: React.ReactNode;
} & ClusterEvents & React.RefAttributes<L.MarkerClusterGroup>>;
export default MarkerClusterGroup;
