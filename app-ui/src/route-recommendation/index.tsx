import React from "react";
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
	MapContainer, TileLayer, Pane,
	Polyline,
	Marker,
	Popup
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { useDataProvider } from 'react-admin';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import L, { point } from "leaflet";
import IconButton from '@mui/material/IconButton';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Button from '@mui/material/Button';



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

const customEndIcon = new L.Icon({
	iconUrl: './location.svg',
	iconSize: new L.Point(40, 47)
});

const customStartIcon = new L.Icon({
	iconUrl: './location-blue.svg',
	iconSize: new L.Point(40, 47)
});

const movingIcon = new L.Icon({
	iconUrl: './truck.png',
	iconSize: new L.Point(40, 47)
});

function App() {
	const dataProvider = useDataProvider();
	// const [graphLoaded, setGraphLoaded] = React.useState(false);
	//const [routes, setRoutes] = React.useState([]);
	const [route, setRoute] = React.useState([]);

	const intialFilters = {
		// randomReRoute: false,
		distanceWeight: 5,
		weatherWeight: 5,
		emissionWeight: 5,
		currentPointIndex: 0,
		// currentPoint: { lat: 51.056070541830934, lng: -114.0765380859375 },
		startPoint: { lat: 51.056070541830934, lng: -114.0765380859375 },
		endPoint: { lat: 51.09619172351068, lng: -114.14039611816406 },
	}


	const [filters, setFilters] = React.useState(intialFilters);
	// const lastFilters = React.useRef(filters); // Ref to store the latest count value
	const [disableAnnimateBtn, setDisableAnnimateBtn] = React.useState(true);
	const [annimationMode, setAnnimationMode] = React.useState(false);
	const [reroute, setReroute] = React.useState(true);

	const [loading, setLoading] = React.useState(false);

	const snackBar = {
		text: '',
		severity: 'info',
		open: false
	}
	const [openSnackBar, setOpenSnackBar] = React.useState(snackBar);


	const handleOpenSnackBar = (text: string, severity: string) => {
		setOpenSnackBar({
			...openSnackBar,
			open: true,
			text: text,
			severity: severity,
		})

	};
	const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackBar(snackBar);
	};

	/*const loadGraph = () => {
		dataProvider.getList('route-recommendation/loadGraph', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: {},
		}).then((res) => {

			setGraphLoaded(true)
		})
		// setTimeout(() => {
		// 	setLoading(false)
		// }, 200);
	}*/

	const reset = () => {
		setRoute([])
		//setRoutes([])
		setFilters({
			...filters,
			currentPointIndex: 0
		})

	}

	const startAnnimationTimer = () => {
		// const numberOfPoints = route.length

		setAnnimationMode(true)
		showRouteAnnimation()
	}

	function generateRandomPointWithDistance(lat: any, lon: any, distanceKm: number) {
		// Radius of the Earth in kilometers
		const earthRadiusKm = 6371;

		// Convert latitude and longitude to radians
		const latRad = degToRad(lat);
		const lonRad = degToRad(lon);

		// Convert distance from kilometers to radians
		const distanceRad = distanceKm / earthRadiusKm;

		// Generate a random bearing in radians (0 to 2*pi)
		const bearingRad = Math.random() * (2 * Math.PI);

		// Calculate the new latitude and longitude
		const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distanceRad) + Math.cos(latRad) * Math.sin(distanceRad) * Math.cos(bearingRad));
		const newLonRad = lonRad + Math.atan2(Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(latRad), Math.cos(distanceRad) - Math.sin(latRad) * Math.sin(newLatRad));

		// Convert new latitude and longitude back to degrees
		const newLat = radToDeg(newLatRad);
		const newLon = radToDeg(newLonRad);

		// Return the new latitude and longitude as an object
		return { lat: newLat, lon: newLon };
	}

	// Helper function to convert degrees to radians
	function degToRad(degrees: number) {
		return degrees * (Math.PI / 180);
	}

	// Helper function to convert radians to degrees
	function radToDeg(radians: number) {
		return radians * (180 / Math.PI);
	}


	const showRouteAnnimation = () => {
		// let newRoutes: ((prevState: never[]) => never[]) | { lat: number; lng: number; }[][] = []
		// console.log(route)
		// let r = route
		// r.splice(0, 5)

		//reset()

		// r.map((points) => {
		// 	points.splice(0, 50)

		// 	if (points.length > 0) {
		// 		newRoutes.push(points)
		// 	}

		// })
		// setRoute(r)
		setFilters({
			...filters,
			currentPointIndex: (filters.currentPointIndex + 5) >= route.length ? (route.length - 1) : filters.currentPointIndex + 5
			//currentPoint: r.length > 0 ? r[0] : filters.endPoint,
		})

	}

	const getRoute = () => {
		reset()
		setLoading(true);
		setTimeout(() => {
			setLoading(false)
		}, 1000);

		dataProvider.getList('route-recommendation/getRoute', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: {
				distanceWeight: filters.distanceWeight,
				weatherWeight: filters.weatherWeight,
				emissionWeight: filters.emissionWeight,
				startPoint: [filters.startPoint.lat, filters.startPoint.lng],
				endPoint: [filters.endPoint.lat, filters.endPoint.lng],
				// startPoint: [startPoint.lat, startPoint.lng],
				// endPoint: [endPoint.lat, endPoint.lng],
			},
		})
			.then((res) => {

				// setGraphLoaded(true)
				if (res.data[0] !== undefined) {
					const edges = res.data[0].edges
					let points = edges.map((edge: { points: any; }) => {
						// edge.points.map((edge) => {
						// 	points.push([edge[1], edge[0]])

						// })
						return edge.points

					})
					// setRoutes([points])
					setRoute(points)
					setDisableAnnimateBtn(false)

					setFilters({
						...filters,
						currentPointIndex: 0
					})

					// if (autoStartAnnimate) {
					// 	setTimeout(() => {
					// 		startAnnimationTimer()
					// 	}, 1500);
					// }


				}

				setLoading(false);

			})
			.catch((error) => {
				setLoading(false);
				handleOpenSnackBar('An error happen while finding the route', 'error')
			})
		// setTimeout(() => {
		// 	setLoading(false)
		// }, 200);
	}

	const startMarkerRef = React.useRef(null)
	const handleDragStartMarker = () => {
		reset()
		const marker = startMarkerRef.current
		if (marker != null) {
			setFilters({
				...filters,
				startPoint: marker.getLatLng(),
				currentPointIndex: 0,
			})

		}

	}

	const endMarkerRef = React.useRef(null)
	const handleDragEndMarker = () => {
		reset()

		const marker = endMarkerRef.current
		if (marker != null) {
			setFilters({
				...filters,
				endPoint: marker.getLatLng(),
			})

		}
	}


	const getCurrentPosition = () => {
		if (navigator?.geolocation) {
			navigator.geolocation.getCurrentPosition((location) => {
				if (location) {
					setFilters({
						...filters,
						startPoint: { lat: location.coords.latitude, lng: location.coords.longitude },
					})
				}
			});
		}
	}



	React.useEffect(() => {
		// if(filters.randomReRoute) {
		// 	setFilters({
		// 		...filters,
		// 		randomReRoute: false
		// 	})
		// 	getRoute(filters.startPoint, filters.endPoint, true)

		// }

		// console.log(annimationMode, route)
		
		if (filters.currentPointIndex === -1) {
			handleOpenSnackBar('Location is not on the route. re-routing again...', 'warning')

			setTimeout(() => {
				getRoute()
			}, 5000);
		} else if(annimationMode === false && reroute === false && filters.currentPointIndex != 0 && filters.currentPointIndex != (route.length - 1)) {
			if(route[filters.currentPointIndex] !== undefined) {
				const newStartPoint = generateRandomPointWithDistance(route[filters.currentPointIndex][0][0], route[filters.currentPointIndex][0][1], 1.5);
				if(newStartPoint !== undefined) {
					setFilters({
						...filters,
						startPoint: { lat: newStartPoint.lat, lng: newStartPoint.lon },
						 currentPointIndex: -1,
					})	
				}	
			}
		} else if ((route.length - 1) === filters.currentPointIndex) {
			setAnnimationMode(false)
		} else if (reroute === true && filters.currentPointIndex > route.length / 2) {
			setAnnimationMode(false)
			setReroute(false)
		} else if (annimationMode && (route.length - 1) > filters.currentPointIndex) {
			setTimeout(() => {
				showRouteAnnimation()
			}, 1000);
		}


	}, [annimationMode, filters.currentPointIndex]);

	React.useEffect(() => {
		if(reroute === false) {

		}
	}, [reroute]);


	React.useEffect(() => {
		reset()
		return () => {
		};

	}, []);


	return (
		<React.Fragment>
			<div style={{ height: '100%' }}>

				<div style={{ display: 'flex' }}>
					<h1>Route Recommendation System:
					</h1>

				</div>
				<Snackbar open={openSnackBar.open} autoHideDuration={6000} onClose={handleCloseSnackBar}>
					<Alert onClose={handleCloseSnackBar} severity={openSnackBar.severity} sx={{ width: '100%' }}>
						{openSnackBar.text}
					</Alert>
				</Snackbar>

				<div>
					<Box style={{ display: 'flex', padding: 5 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={4}>
								Distance Effect:
								<Slider step={1} marks min={1} max={10} aria-label="Default" valueLabelDisplay="auto" value={filters.distanceWeight}
									onChange={(event: Event, newValue: number | number[]) => {
										setFilters({
											...filters,
											distanceWeight: newValue as number,
										})
										setRoute([])
										// reset()
									}
									}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								Extreme Weather Effect:
								<Slider step={1} marks min={1} max={10} aria-label="Default" valueLabelDisplay="auto" value={filters.weatherWeight}
									onChange={(event: Event, newValue: number | number[]) => {
										setFilters({
											...filters,
											weatherWeight: newValue as number,
										})
										setRoute([])
									}

									}

								/>
							</Grid>
							<Grid item xs={12} md={4}>
								Gas Emission Effect:
								<Slider step={1} marks min={1} max={10} aria-label="Default" valueLabelDisplay="auto" value={filters.emissionWeight}
									onChange={(event: Event, newValue: number | number[]) => {
										setFilters({
											...filters,
											emissionWeight: newValue as number,
										});
										setRoute([])
									}
									}

								/>
							</Grid>


							<Grid item xs={12} md={4} style={{ display: 'flex' }}>
								<TextField
									id="filled-multiline-static"
									disabled={true}
									label="Start Point"
									value={`${filters.startPoint.lat}, ${filters.startPoint.lng}`}
									// onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									// 	setFilters({
									// 		...filters,
									// 		startPoint: event.target.value,
									// 	});
									// 	reset()

									// }
									// }
									style={{ width: '100%' }}
									variant="filled"
								/>
								<IconButton
									aria-label="location"
									onClick={() => getCurrentPosition()}
									color="primary"
								>
									<GpsFixedIcon />
								</IconButton>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									id="filled-multiline-static"
									disabled={true}
									label="End Point"
									value={`${filters.endPoint.lat}, ${filters.endPoint.lng}`}
									// onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									// 	setFilters({
									// 		...filters,
									// 		endPoint: event.target.value,
									// 	});
									// 	reset()
									// }
									// }
									style={{ width: '100%' }}
									variant="filled"
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<LoadingButton loading={loading} disabled={filters.startPoint == filters.endPoint} variant="contained" style={{ marginTop: 15 }} 
								onClick={() => getRoute()}>
									Find the route
								</LoadingButton>

								<Button
									style={{ marginTop: 15, marginLeft: 15, height: 'fit-content', }}
									variant="contained"
									color="warning"
									// disabled={disableAnnimateBtn || routes[0] === undefined || routes[0].length === 0}
									disabled={disableAnnimateBtn || route.length === 0}
									onClick={() => {
										setDisableAnnimateBtn(true)
										startAnnimationTimer()
									}}
								>
									Show the route
								</Button>


							</Grid>
						</Grid>


					</Box>
				</div>


				<MapContainer
					style={{ height: "70%" }}
					center={[51.0447, -114.0719]}
					zoom={12}
					scrollWheelZoom={true}
				>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
					/>
					<Pane
						name="route"
					>
						{/*routes.map((points, i) => (
							<Polyline key={i} positions={points} color="Navy" weight={4} lineCap="square" />
						))*/}
						{
							<Polyline positions={route} color="Navy" weight={4} lineCap="square" />

						}
					</Pane>
					<Marker
						icon={customStartIcon}
						draggable={true}
						zIndexOffset={1}
						eventHandlers={{ drag: handleDragStartMarker }}
						position={filters.startPoint}
						ref={startMarkerRef}>
						<Popup minWidth={90}>
							<span >
								Start Point
							</span>
						</Popup>
					</Marker>
					<Marker
						icon={movingIcon}
						draggable={false}
						zIndexOffset={0}
						position={(route[filters.currentPointIndex] !== undefined && route[filters.currentPointIndex][0] !== undefined) ? { lat: route[filters.currentPointIndex][0][0], lng: route[filters.currentPointIndex][0][1] } : filters.startPoint}

					>
						<Popup minWidth={90}>
							<span >
								Our Location
							</span>
						</Popup>
					</Marker>



					<Marker
						icon={customEndIcon}
						draggable={true}
						eventHandlers={{ drag: handleDragEndMarker }}
						position={filters.endPoint}
						ref={endMarkerRef}
						zIndexOffset={0}
						>
							
						<Popup minWidth={90}>
							<span >
								End Point
							</span>
						</Popup>
					</Marker>
				</MapContainer>

			</div>

		</React.Fragment>
	);
}

export default App;
