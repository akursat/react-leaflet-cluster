import { extendContext, createElementObject, createPathComponent, } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
// CSS imports removed to prevent Next.js issues
// Users should import CSS separately:
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
// Users should configure their own icon URLs as needed
// Example:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('./assets/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('./assets/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('./assets/marker-shadow.png', import.meta.url).href,
});
function getPropsAndEvents(props) {
    let clusterProps = {};
    let clusterEvents = {};
    const { children, ...rest } = props;
    // Splitting props and events to different objects
    Object.entries(rest).forEach(([propName, prop]) => {
        if (propName.startsWith('on')) {
            clusterEvents = { ...clusterEvents, [propName]: prop };
        }
        else {
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
    return createElementObject(markerClusterGroup, extendContext(context, { layerContainer: markerClusterGroup }));
}
const updateMarkerCluster = (instance, props, prevProps) => {
    //TODO when prop change update instance
    //   if (props. !== prevProps.center || props.size !== prevProps.size) {
    //   instance.setBounds(getBounds(props))
    // }
};
const MarkerClusterGroup = createPathComponent(createMarkerClusterGroup, updateMarkerCluster);
export default MarkerClusterGroup;
