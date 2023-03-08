import React from "react";
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, TileLayer, Popup, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';


const customIcon = new L.Icon({
	iconUrl: './location.svg',
	iconSize: new L.Point(40, 47)
});

const createClusterCustomIcon = function (cluster: MarkerCluster) {
	return L.divIcon({
		html: `<span>${cluster.getChildCount()}</span>`,
		className: "custom-marker-cluster",
		iconSize: L.point(33, 33, true)
	});
};

function App() {
	const vectorRef = React.useRef()

	const [layers, setLayers] = React.useState({
		baseLayer1: true,
		baseLayer2: false,
		points1: false,
	});

	const mapbox = {
		VITE_USERNAME: 'mahdimzh',
		VITE_STYLE_ID: [
			'clf042xz0000901o5wbobakrc',
			'clf06sl1t000101lg61z83ktz'
		],

		VITE_ACCESS_TOKEN: 'pk.eyJ1IjoibWFoZGltemgiLCJhIjoiY2xlenpubWRzMDQ2cDN1c2FjaXJ0ZXFuZCJ9.YdIZG1iPsG308d9litgJ8g'
	}

	const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.name.startsWith("points")) {
			setLayers({
				...layers,
				[event.target.name]: event.target.checked,
			});	
		}
		if(event.target.name.startsWith("baseLayer")) {
			setLayers({
				...layers,
				'baseLayer1': event.target.name === 'baseLayer1' ? event.target.checked : !event.target.checked,
				'baseLayer2': event.target.name === 'baseLayer2' ? event.target.checked : !event.target.checked,
			});	
		}

		// const defaultStyle = {
		// 	fillColor: 'blue',
		// 	fillOpacity: 0.5,
		// 	weight: 2,
		// 	color: 'white',
		//   };

		// if(vectorRef.current !== undefined) {

		// 	const vectorLayer = vectorRef.current;
		// 	const layer = vectorLayer.getLayers()[1];
		// 	if (layer) {
		// 		layer.setVisible(false);

		// 	}


		// 	if (vectorLayer.options.style) {
		// 	  // If a style is already set, remove it
		// 	  vectorLayer.options.style = null;

		// 	//   vectorLayer.setStyle(defaultStyle);
		// 	} else {
		// 	  // If no style is set, add a new style
		// 	  const newStyle = {
		// 		fillColor: 'red',
		// 		fillOpacity: 0.8,
		// 		weight: 4,
		// 		color: 'white',
		// 	  };
		// 	//   vectorLayer.setStyle(newStyle);
		// 	}


		// 	setLayers({
		// 		...layers,
		// 		[event.target.name]: event.target.checked,
		// 	});	
		// }
	};

	return (
		<React.Fragment>


			<div style={{ display: 'flex' }}>
				<h1>Map Layer:
				</h1>
			</div>
			<div>
				<FormControl component="fieldset" variant="standard">
					<FormLabel component="legend">Layers...</FormLabel>
					<FormGroup style={{ display: 'block' }}>
						<FormControlLabel
							control={
								<Switch checked={layers.baseLayer1} onChange={handleLayerChange} name="baseLayer1" />
							}
							label="Open Street Map"
						/>
						<FormControlLabel
							control={
								<Switch checked={layers.baseLayer2} onChange={handleLayerChange} name="baseLayer2" />
							}
							label="Customized Mapbox"
						/>
						<FormControlLabel
							control={
								<Switch checked={layers.points1} onChange={handleLayerChange} name="points1" />
							}
							label="Accidents"
						/>
					</FormGroup>
					<FormHelperText></FormHelperText>
				</FormControl>
			</div>

			{
				<MapContainer

					style={{ height: "70%" }}
					center={[51.0447, -114.0719]}
					zoom={10}
					scrollWheelZoom={true}
				>

					<LayerGroup ref={vectorRef}>

						{
							layers.baseLayer1 &&
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" zIndex={1} />
						}
						{
							layers.baseLayer2 &&
							<TileLayer
								zIndex={1}
								attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
								url={`https://api.mapbox.com/styles/v1/${mapbox.VITE_USERNAME}/${mapbox.VITE_STYLE_ID[1]}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapbox.VITE_ACCESS_TOKEN}&zoomwheel=true&fresh=true`}
							/>
						}
						{
							layers.points1 &&
							<TileLayer
								zIndex={2}
								attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
								url={`https://api.mapbox.com/styles/v1/${mapbox.VITE_USERNAME}/${mapbox.VITE_STYLE_ID[0]}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapbox.VITE_ACCESS_TOKEN}&zoomwheel=true&fresh=true`}
							/>
						}
					</LayerGroup>
				</MapContainer>
			}
		</React.Fragment>
	);
}

export default App;
