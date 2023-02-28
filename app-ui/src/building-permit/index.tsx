import React from "react";
import L, { MarkerCluster } from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { addressPoints } from "./realworld";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { useDataProvider } from 'react-admin';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'


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
	const dataProvider = useDataProvider();

	const [points, setPoints] = React.useState([]);

	const [openFilters, setOpenFilters] = React.useState(false);
	const [loading, setLoading] = React.useState(true);

	const filtersInit = {
		issueDateEnd: null,
		issueDateStart: null,
	}
	const [filters, setFilters] = React.useState(filtersInit);

	React.useEffect(() => {

	}, [openFilters]);


	const resetMap = () => {
		setPoints([])
		setLoading(true)
		setFilters(filtersInit)
	}

	const reloadMap = () => {
		dataProvider.getList('building-permits/get_calgary_building_permit', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: filters,
		}).then((res) => {
			if (res.data && Array.isArray(res.data)) {
				setPoints(res.data[0].features)
			}
			setOpenFilters(false)
			setLoading(false)
		})
		// setTimeout(() => {
		// 	setLoading(false)
		// }, 200);
	}

	React.useEffect(() => {
		reloadMap()
		return () => {
			resetMap()
		};

	}, []);
	return (
		<React.Fragment>

			<Drawer
				anchor={'right'}
				open={openFilters}
				onClose={() => setOpenFilters(false)}
			>

				<Box sx={{ width: 200, maxWidth: 360, bgcolor: 'background.paper', paddingLeft: 2, paddingRight: 2 }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Issued Date Start"
							value={filters.issueDateStart}
							onChange={(newValue) => {
								setFilters({ ...filters, issueDateStart: moment(new Date(newValue)).format('YYYY-MM-DD') })
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
						<DatePicker
							label="Issued Date End"
							value={filters.issueDateEnd}
							onChange={(newValue) => {


								// if(newValue) {
								// 	var n = newValue.indexOf('T');
								// 	newValue = newValue.substring(0, n);
								// }
								setFilters({ ...filters, issueDateEnd: moment(new Date(newValue)).format('YYYY-MM-DD') })
							}}
							renderInput={(params) => <TextField {...params} />}
						/>

					</LocalizationProvider>


					<Divider />

					<nav aria-label="main mailbox folders">
						<List >
							<ListItem disablePadding style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Button variant="contained" onClick={() => reloadMap()} disabled={filters.issueDateStart == null || filters.issueDateEnd == null}>Search</Button>
							</ListItem>
						</List>

					</nav>
				</Box>

			</Drawer>
			<div style={{ display: 'flex' }}>
				<h1>Calgary Building Permits Map: Number of points ({points.length})
					<IconButton color="primary" aria-label="filter" component="label" onClick={() => {  setOpenFilters(true) }}>
						<FilterListIcon />
					</IconButton>
				</h1>
			</div>
			{
				loading === true &&
				<Skeleton variant="rounded" height={300} />
			}
			{
				loading === false &&
				<MapContainer
					style={{ height: "80%" }}
					center={[51.0447, -114.0719]}
					zoom={10}
					scrollWheelZoom={true}
				>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<MarkerClusterGroup chunkedLoading>
						{(points).map((point, index) => {
							if (point.geometry) {
								return (
									<Marker
										icon={customIcon}
										key={index}
										position={[point.geometry.coordinates[1], point.geometry.coordinates[0]]}
										title={point.properties.communityname}
									>
										<Popup>
											<List>
												<ListItem >
													<b>Compunity Name: </b> {point.properties.communityname}
												</ListItem>
												<ListItem style={{ overflowX: 'hidden' }} >
													<b>Description: </b> {point.properties.description}
												</ListItem>
												<ListItem >
													<b>Contractor Name: </b> {point.properties.contractorname}
												</ListItem>
												<ListItem >
													<b>Complete Date: </b> {point.properties.completeddate}
												</ListItem>
												<ListItem >
													<b>Issued Date: </b> {point.properties.issueddate}
												</ListItem>
												<ListItem >
													<b>Applied Date: </b> {point.properties.applieddate}
												</ListItem>
												<ListItem >
													<b>Housing Units: </b> {point.properties.housingunits}
												</ListItem>
												<ListItem >
													<b>Permit Class: </b> {point.properties.permitclass}
												</ListItem>
												<ListItem >
													<b>Work Class Group: </b> {point.properties.workclassgroup}
												</ListItem>
												<ListItem >
													<b>Original Address: </b> {point.properties.originaladdress}
												</ListItem>
											</List>
										</Popup>
									</Marker>
								)
							}
						})}
					</MarkerClusterGroup>
				</MapContainer>
			}
		</React.Fragment>
	);
}

export default App;
