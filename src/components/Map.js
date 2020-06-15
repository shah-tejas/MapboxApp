import React, { useState } from 'react';
import ReactMapGL from "react-map-gl";

export default function Map() {
    const [viewport, setViewport] = useState({
        latitude: 39.7837304,
        longitude: -100.4458825,
        width: "60vw",
        height: "75vh",
        zoom: 3
    })
    console.log(process.env.REACT_APP_MAPBOX_TOKEN);
    return (
        <div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            >

            </ReactMapGL>
        </div>
    )
}