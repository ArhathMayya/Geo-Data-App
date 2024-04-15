import React, { useState, useEffect } from 'react';
import '../App.css';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Button from '@mui/material/Button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { isLogin } from '../store/reducers/menu';
import Grid from '@mui/material/Grid';
import L from 'leaflet';
import { EditControl } from "react-leaflet-draw";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, Circle, Rectangle } from "react-leaflet";

// Fixing the broken image issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

function MapLayout() {
  // State variables for GeoJSON data, map layers, and file
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [mapLayers, setMapLayers] = useState({
    shapes: []
  });
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.menu);
  const [Login, setLogin] = useState(login);

  // Fetching GeoJSON data from the server
  useEffect(() => {
    axios.post('http://localhost:3001/getgeojson', { Email: sessionStorage.getItem("email") })
      .then((res) => {
        if (res.data.message !== "No GeoJson") {
          setGeoJsonData(JSON.parse(res.data.message));
        }
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
      });
  }, []);

  // Fetching ShapeJSON data from the server
  useEffect(() => {
    axios.post('http://localhost:3001/getshapejson', { Email: sessionStorage.getItem("email") })
      .then((res) => {
        if (res.data.message !== "No ShapeJson") {
          setMapLayers(JSON.parse(res.data.message));
        }
      })
      .catch((error) => {
        console.error("Error fetching ShapeJSON:", error);
      });
  }, []);

  // Function to handle shape creation
  const _onCreated = e => {
    const { layerType, layer } = e;
  
    if (layerType === 'circle' || layerType === 'rectangle' || layerType === 'polygon' || layerType === 'circlemarker') {
      const { _leaflet_id } = layer;
      const shapeData = {
        id: _leaflet_id,
        type: layerType,
        coordinates: layerType === 'circle' || layerType === 'circlemarker' ? [layer._latlng.lng, layer._latlng.lat] : layer._latlngs[0].map(latlng => [latlng.lng, latlng.lat]),
        attributes: {} // You can add attributes here if needed
      };
      setMapLayers(prevState => ({
        ...prevState,
        shapes: [...prevState.shapes, shapeData]
      }));
    }
  };

  // Function to handle shape editing
  const _onEdited = e => {
    const { layer, layerType } = e;
    const editedLayerId = Object.keys(e.layers._layers)[0];
  
    setMapLayers(prevMapLayers => {
      return {
        ...prevMapLayers,
        shapes: prevMapLayers.shapes.map(mapLayer => {
          if (mapLayer.id === editedLayerId) {
            const updatedShapeData = {
              ...mapLayer,
              coordinates: layerType === 'circle' ? [layer.getLatLng().lng, layer.getLatLng().lat] : layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat])
            };
            return updatedShapeData;
          }
          return mapLayer;
        })
      };
    });
  };

  // Function to handle shape deletion
  const _onDeleted = e => {
    const IdsToDelete = Object.keys(e.layers._layers);
  
    if (IdsToDelete.length === 0) {
      console.error("No layers to delete");
      return;
    }
  
    setMapLayers(prevLayers => {
      return {
        ...prevLayers,
        shapes: prevLayers.shapes.filter(layer => !IdsToDelete.includes(layer.id))
      };
    });
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setGeoJsonData(JSON.parse(content));
    };

    reader.readAsText(file);
  };

  // Function to handle saving GeoJSON data
  const handleGeoJsonSave = () => {
    if (geoJsonData) {
      axios.post('http://localhost:3001/savegeojson', {
        email: sessionStorage.getItem("email"),
        geojson: JSON.stringify(geoJsonData)
      })
      .then((res) => {
        console.log(res.data.message);
        alert("Upload Successful");
      })
      .catch((error) => {
        console.error('Error saving GeoJSON:', error);
      });
    }
  };

  // Function to handle saving ShapeJSON data
  const handleShapeJsonSave = () => {
    if (mapLayers) {
      axios.post('http://localhost:3001/saveshapejson', {
        email: sessionStorage.getItem("email"),
        shapejson: JSON.stringify(mapLayers)
      }).then((res) =>{
        if (res.data.message === "Shape JSON upload successful") {
          alert("Upload Successful");
        } else {
          alert("Could Not Upload Data");
        }
      });
    }
  };

  // Function to handle logout
  const handleLogout =() => {
    dispatch(isLogin({ login: !Login }));
    sessionStorage.setItem('Login', "false");
    sessionStorage.setItem('email', '');
  };

  return (
    <div>
      <h1>Draw Shapes from GeoJSON</h1>
      <input type="file" accept=".geojson" onChange={handleFileChange} />
      <MapContainer
        className="markercluster-map"
        center={[12.9716, 77.5946]}
        zoom={13}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreated}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
          />
        </FeatureGroup>
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={() => ({
              color: '#ff7800',
              weight: 5,
              opacity: 0.65,
            })}
          />
        )}
        {mapLayers && mapLayers.shapes.map(shape => {
          if (shape.type === 'polygon') {
            return (
              <GeoJSON
                key={shape.id}
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Polygon',
                    coordinates: [shape.coordinates]
                  }
                }}
                style={() => ({
                  color: '#ff7800',
                  weight: 5,
                  opacity: 0.65
                })}
              />
            );
          } else if (shape.type === 'polyline') {
            return (
              <GeoJSON
                key={shape.id}
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: shape.coordinates
                  }
                }}
                style={() => ({
                  color: '#ff7800',
                  weight: 5,
                  opacity: 0.65
                })}
              />
            );
          } else if (shape.type === 'rectangle') {
            const bounds = [
              [shape.coordinates[1], shape.coordinates[0]], // [lat1, lng1]
              [shape.coordinates[3], shape.coordinates[2]]  // [lat2, lng2]
            ];
            return (
              <Rectangle
                key={shape.id}
                bounds={bounds}
                pathOptions={{ color: '#ff7800' }}
              />
            );
          }
          return null;
        })}
      </MapContainer>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" onClick={handleGeoJsonSave}>SAVE GeoJSON</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleShapeJsonSave}>SAVE ShapeJSON</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleLogout}>LOGOUT</Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default MapLayout;
