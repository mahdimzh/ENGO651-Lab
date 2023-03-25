import React from "react";
import * as turf from '@turf/turf'
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { MapContainer, Marker, TileLayer, FeatureGroup, Popup, Polygon } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import { latLng } from "leaflet";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';



const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {

	const [simplifiedList, setSimplifiedList] = React.useState<any>({});
	// const [editableFG, setEditableFG] = React.useState<any>(null);
	const [showSimplified, setShowSimplified] = React.useState<boolean>(true);

	const generateSimplified = (latlngs: Array<any>) => {
		if (latlngs[0] !== latLng[latlngs.length - 1]) {
			latlngs.push(latlngs[0])
		}
		const geojson = turf.polygon([latlngs]);
		const options = { tolerance: 0.01, highQuality: true };
		const simplified = turf.simplify(geojson, options);


		return simplified.geometry.coordinates
	}


	const onDeleted = (e: any) => {
		setSimplifiedList({})
	}

	const onEdited = (e: any) => {
		console.log(e)
		const layers = e.layers._layers;
		Object.keys(layers).forEach((layerid, index) => {

			const layer = layers[layerid];
			const simplified = generateSimplified(layer.editing.latlngs[0][0].map((latLng: { lat: any; lng: any; }) => [latLng.lat, latLng.lng]));
			setSimplifiedList({
				...simplifiedList,
				[index]: simplified,
			});	

		});
	}

	const onCreated = (e: any) => {
		console.log(e)
		if (e.layer.editing.latlngs[0] !== undefined && e.layer.editing.latlngs[0][0] !== undefined) {
			const simplified = generateSimplified(e.layer.editing.latlngs[0][0].map((latLng: { lat: any; lng: any; }) => [latLng.lat, latLng.lng]));

			setSimplifiedList({
				...simplifiedList,
				[e.layer._leaflet_id]: simplified,
			});	


		}

		// if (editableFG) {
		// 	const drawnItems = editableFG.leafletElement._layers;
		// 	console.log(drawnItems);
		// 	if (Object.keys(drawnItems).length > 1) {
		// 		Object.keys(drawnItems).forEach((layerid, index) => {
		// 			if (index > 0) return;
		// 			const layer = drawnItems[layerid];
		// 			editableFG.leafletElement.removeLayer(layer);
		// 		});
		// 		console.log(drawnItems);
		// 	}
		// }
	};

	const onFeatureGroupReady = (reactFGref: React.SetStateAction<null>) => {
		// setEditableFG(reactFGref);
	};


	React.useEffect(() => {
		return () => {

		};

	}, []);


	return (
		<React.Fragment>
			<div style={{ display: 'flex' }}>
				<h1>Turf Simplify:
				</h1>

			</div>

			<div>
				<FormControl component="fieldset" variant="standard">
					<FormLabel component="legend">Layers...</FormLabel>
					<FormGroup style={{ display: 'block' }}>
						<FormControlLabel
							control={
								<Switch checked={showSimplified} onChange={() => setShowSimplified(!showSimplified)} name="baseLayer1" />
							}
							label="Show Simplified"
						/>

					</FormGroup>
					<FormHelperText></FormHelperText>
				</FormControl>
			</div>


			<MapContainer
				style={{ height: "80%" }}
				center={[51.0447, -114.0719]}
				zoom={12}
				scrollWheelZoom={true}

			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
				/>
				{
					showSimplified === true && Object.values(simplifiedList).map((simplified, key) => {

						return <Polygon key={key} color="pink" positions={simplified} />
					})
				}


				<FeatureGroup
					ref={featureGroupRef => {
						onFeatureGroupReady(featureGroupRef);
					}}>
					<EditControl
						position="topright"
						onCreated={onCreated}
						onDeleted={onDeleted}
						onEdited={onEdited}
						//					onEdited={this._onEditPath}
						//					onCreated={this._onCreate}
						//					onDeleted={this._onDeleted}
						draw={{
							rectangle: false,
							circle: false,
							marker: false,
							circlemarker: false,
							polyline: false,

						}}

					/>
				</FeatureGroup>
			</MapContainer>
		</React.Fragment>
	);
}

export default App;
