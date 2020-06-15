import React, { useState , useRef, useEffect} from 'react';
import ReactMapGL, {Marker} from "react-map-gl";
import axios from 'axios';
import cam from './cam.png';

import Webcam from './Webcam';

export default function Map() {
    const [viewport, setViewport] = useState({
        latitude: 39.7837304,
        longitude: -100.4458825,
        width: "60vw",
        height: "75vh",
        zoom: 5
    })
    const [mapbounds, setMapbound] = useState({
        neLng: 0,
        neLat: 0,
        swLng: 0,
        swLat: 0
    })
    const mapRef = useRef(null);
    const [webcams, setWebcams] = useState([])

    const [imgprev, setImgprev] = useState(null);

    const updateBounds = (bounds) => {
        if(bounds && bounds._ne && bounds._sw) {
            setMapbound({
                neLng: bounds._ne.lng,
                neLat: bounds._ne.lat,
                swLng: bounds._sw.lng,
                swLat: bounds._sw.lat
            })
        }
    }

    const updateWebcams = () => {

        const bboxURL = `https://webcamstravel.p.rapidapi.com/webcams/list/bbox=${mapbounds.neLat},${mapbounds.neLng},${mapbounds.swLat},${mapbounds.swLng}`;
            axios.get(bboxURL, {
                headers: {
                    'x-rapidapi-host': 'webcamstravel.p.rapidapi.com',
                    'x-rapidapi-key': 'ea4762f925mshebe3d557283e76cp155833jsna6d8b259c3b7'
                }
            }).then(res => {
                const allwebcams = res.data.result.webcams;
                if(allwebcams) {
                    setWebcams([]);
                    allwebcams.map(webcam => {
                        axios.get(`https://webcamstravel.p.rapidapi.com/webcams/list/webcam=${webcam.id}?lang=en&show=webcams:image,location`, {
                            headers: {
                                'x-rapidapi-host': 'webcamstravel.p.rapidapi.com',
                                'x-rapidapi-key': 'ea4762f925mshebe3d557283e76cp155833jsna6d8b259c3b7'
                            }
                        }).then(res => {
                            const imgsrc = res.data.result.webcams[0].image.current.preview;
                            const lt = res.data.result.webcams[0].location.latitude;
                            const lng = res.data.result.webcams[0].location.longitude;
                            setWebcams(webcams => webcams.concat({
                                webcamid: webcam.id,
                                long: lng,
                                lat: lt,
                                img: imgsrc
                            }))
                        })
                    })
                }
                
            })
    }


    useEffect(() => {
        if(mapRef) {
            const mapGl = mapRef.current.getMap();
            const bounds = mapGl.getBounds();
            updateBounds(bounds);
        }
    }, [viewport]);

    useEffect(() => {
        if(mapbounds) {
            updateWebcams();
        }
    }, [mapbounds]);



    return (
        <div className="maparea">
            <h2>View live cameras around the world!</h2>
            <p>(Click the camera icon on the map)</p>
            <div className="mapcontent">
                <div>
                    <ReactMapGL
                        {...viewport}
                        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        onViewportChange={viewport => {
                            setViewport(viewport);
                            setWebcams([]);
                        }}
                        ref={mapRef}
                    >
                        {webcams.map(webcam => (
                            <Marker 
                                key={webcam.webcamid}
                                latitude={webcam.lat}
                                longitude={webcam.long}
                            >
                                <button
                                    className="marker-btn"
                                    onClick={e => {
                                        e.preventDefault();
                                        setImgprev(webcam.img)
                                    }}
                                >
                                    <img src={cam} alt="Skate Park Icon" width={10} height={10} />
                                </button>    
                            </Marker>
                        ))}
                    </ReactMapGL>
                </div>
                <div>
                    {imgprev && <Webcam prev={imgprev} />}
                </div>
            </div>
            
        </div>
    )
}