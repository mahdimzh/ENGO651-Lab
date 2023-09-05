import React from "react";
import L, { MarkerCluster, point } from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
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
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { apiUrl } from "../dataProvider";
import {
	TransformWrapper,
	TransformComponent,
	ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css'
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Colors,
	ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { setInterval } from "timers/promises";
import { Icon } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import { useGlobal } from "../App";
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LowPriorityIcon from '@mui/icons-material/LowPriority';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Colors,
	ArcElement
);


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));


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

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	height: '100%',
}));

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function App() {
	const dataProvider = useDataProvider();
	const { flag, setFlag } = useGlobal();

	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const initialReport = {
		group_by_status: [],
		group_by_repair_type: [],
		request_per_day: [],

	}

	const [resizing, setResizing] = React.useState(true);

	const [planning, setPlanning] = React.useState({});
	const [points, setPoints] = React.useState([]);
	const [report, setReport] = React.useState(initialReport);


	const initialChartType = {
		requestStatusChart: 'BAR',
		repairTypeChart: 'BAR',
		requestPerDayChart: 'BAR',
	}

	const [chartTye, setChartType] = React.useState(initialChartType);


	const [openFilters, setOpenFilters] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const filtersInit = {
		issueDateEnd: null,
		issueDateStart: null,
		d00: null,
		d10: null,
		d20: null,
		d40: null,
		budget: 50000,
		pavement_cost: [1000, 1500, 1800, 2200],
		points_payevemnt: [],
	}



	const [filters, setFilters] = React.useState(filtersInit);

	React.useEffect(() => {

	}, [openFilters]);


	const [statusOptions, setStatusOptions] = React.useState({
		indexAxis: 'y' as const,
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right' as const,
				display: false
			},
			title: {
				display: true,
				text: 'Request Status',
			},
		},
		maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio

	});


	const statusLabels = ['Not started', 'Inspected', 'In Progress', 'Fixed'];
	const [statusData, setStatusData] = React.useState({
		labels: statusLabels,
		datasets: [{
			label: '',
			data: [
				report.group_by_status.filter((type) => type.status == 0).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 1).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 2).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 3).map((type) => type.count)[0],
			],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)'
			],
			borderColor: [
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)'
			],
			borderWidth: 1
		}]
	});


	const repairTypeOptions = {
		indexAxis: 'y' as const,
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right' as const,
				display: false
			},
			title: {
				display: true,
				text: 'Repair Type',
			},
		},
		maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio

	};

	const repairTypeLabels = ['type1', 'type2', 'type3', 'type4'];
	const repairTypeData = {
		labels: repairTypeLabels,
		datasets: [{
			label: '',
			data: [
				report.group_by_repair_type.filter((type) => type.repair_type == 0).map((type) => type.count)[0],
				report.group_by_repair_type.filter((type) => type.repair_type == 1).map((type) => type.count)[0],
				report.group_by_repair_type.filter((type) => type.repair_type == 2).map((type) => type.count)[0],
				report.group_by_repair_type.filter((type) => type.repair_type == 3).map((type) => type.count)[0],
			],
			borderWidth: 1
		}]
	};


	const requestPerDayOptions = {
		indexAxis: 'x' as const,
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right' as const,
				display: false
			},
			title: {
				display: true,
				text: 'Request Per Day',
			},
		},
		maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio

	};

	const requestPerDayLabels = report.request_per_day.map((type) => type.date);
	const requestPerDayData = {
		labels: requestPerDayLabels,
		datasets: [{
			label: '',
			data: report.request_per_day.map((type) => type.count),
			borderWidth: 1
		}]
	};
	const resetMap = () => {
		setPoints([])
		setReport(initialReport)
		// setLoading(true)
		setFilters(filtersInit)
	}

	const reloadMap = () => {
		dataProvider.getList('pavement-cracks/get_pavement_cracks', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: filters,
		}).then((res) => {
			if (res.data && Array.isArray(res.data)) {
				setPoints(res.data)
			}
			setOpenFilters(false)
			setLoading(false)
		})
		// setTimeout(() => {
		// 	setLoading(false)
		// }, 200);

		dataProvider.getList('pavement-cracks/get_reports', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: filters,
		}).then((res) => {
			if (res.data && Array.isArray(res.data) && res.data.length == 1) {
				setReport(res.data[0].data)
			}


			setOpenFilters(false)
			setLoading(false)
		})

	}

	const get_planning = () => {
		return dataProvider.getList('pavement-cracks/get_planning', {
			pagination: { page: 0, perPage: 0 },
			sort: { field: '', order: '' },
			filter: {
				...filters,
				points_payevemnt: points.map((point) => [point.latitude, point.longitude])
			},
		}).then((res) => {
			if (res.data && Array.isArray(res.data) && res.data.length == 1) {
				setPlanning(res.data[0])
			}


			setOpenFilters(false)
			setLoading(false)
		})

	}

	const transformComponentRef = React.useRef<ReactZoomPanPinchRef | null>(null);

	const zoomToImage = () => {
		if (transformComponentRef.current) {
			const { zoomToElement } = transformComponentRef.current;
			zoomToElement("imgExample");
		}
	};

	const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
		<>
			<button onClick={() => zoomIn()}>+</button>
			<button onClick={() => zoomOut()}>-</button>
			<button onClick={() => resetTransform()}>x</button>
		</>
	);

	const [verticalSizes, setVerticalSizes] = React.useState([
		'auto',
		'50%',
		'auto',
	]);


	const [middleHorizontalSize, setMiddleHorizontalSize] = React.useState([
		'70%',
		'auto',
	]);


	const layoutCSS = {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};


	React.useEffect(() => {
		reloadMap()
		return () => {
			resetMap()
		};

	}, []);


	React.useEffect(() => {
		const datasetsData = {
			...statusData.datasets[0],
			data: [
				report.group_by_status.filter((type) => type.status == 0).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 1).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 2).map((type) => type.count)[0],
				report.group_by_status.filter((type) => type.status == 3).map((type) => type.count)[0],
			]
		}
		setStatusData({
			...statusData,
			datasets: [datasetsData]
		})

	}, [report]);



	React.useEffect(() => {
		get_planning()

	}, [points]);


	React.useEffect(() => {
		// const mapContainer = document.getElementsByClassName('my-map-container')[0]
		// if (mapContainer) {
		// 	const newWidth = mapContainer.clientWidth;
		// 	const newHeight = mapContainer.clientHeight;
		// 	console.log(newWidth, newHeight)


		// }

		// const handleResize = () => {
		// 	const newWidth1 = document.getElementsByClassName('my-map-container')[0].clientWidth;
		// 	const newHeight1 = document.getElementsByClassName('my-map-container')[0].clientHeight;
		// 	//   console.log(newWidth1, newHeight1)
		// 	//  setMapSize({ width: newWidth, height: newHeight });
		// };

		// window.addEventListener('my-map-container', handleResize);
		// return () => window.removeEventListener('my-map-container', handleResize);


		const t = setTimeout(() => {
			const mapContainer = document.getElementById('my-map-container')
			if (mapContainer) {
				const newWidth = mapContainer.clientWidth;
				const newHeight = mapContainer.clientHeight;

				setVerticalSizes(verticalSizes => {
					const newArray = [...verticalSizes];
					newArray[1] = newWidth;
					return newArray;
				});

				setMiddleHorizontalSize(middleHorizontalSize => {
					const newArray = [...middleHorizontalSize];
					newArray[0] = newHeight;
					return newArray;
				});

				setResizing(false)
			}
		}, 500);

		return () => clearTimeout(t)


	}, []);


	React.useEffect(() => {
		if (flag) {
			setOpenFilters(flag)
		}

	}, [flag]);


	React.useEffect(() => {
		setFlag(openFilters)
	}, [openFilters]);


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
							label="Start Date"
							value={filters.issueDateStart}
							onChange={(newValue) => {
								setFilters({ ...filters, issueDateStart: moment(new Date(newValue)).format('YYYY-MM-DD') })
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
						<DatePicker
							label="End Date"
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

					<FormControl component="fieldset" variant="standard">
						<FormLabel component="legend">Crack types:</FormLabel>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										checked={filters.d00}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, [event.target.name]: event.target.checked })}
										name="d00"
									/>
								}
								label="Longitudinal"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={filters.d10}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, [event.target.name]: event.target.checked })}
										name="d10"
									/>
								}
								label="Lateral"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={filters.d20}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, [event.target.name]: event.target.checked })}
										name="d20"
									/>

								}
								label="Alligator Crack"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={filters.d40}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, [event.target.name]: event.target.checked })}
										name="d40"
									/>

								}
								label="Other Corruption"
							/>

						</FormGroup>
						<FormHelperText>Select one or more</FormHelperText>
					</FormControl>

					<nav aria-label="main mailbox folders">
						<List >
							<ListItem disablePadding style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Button variant="contained" onClick={() => reloadMap()} >Search</Button>
							</ListItem>
						</List>

					</nav>
				</Box>

			</Drawer>
			<div style={{ height: '100%' }}>
				<SplitPane
					split='vertical'
					sizes={verticalSizes}
					onChange={setVerticalSizes}
					onDragStart={(e) => setResizing(true)}
					onDragEnd={(e) => setResizing(false)}
				// sashRender={(e) => console(e == 1)}

				>
					<Pane minSize={150} maxSize='50%'>
						<div style={{ ...layoutCSS, background: 'white' }}>
							<Grid container spacing={2} style={{ display: 'block', height: '100%' }}>
								<Grid item style={{ height: '50%', paddingTop: 0 }}>
									{
										chartTye.requestStatusChart == 'BAR' &&
										<IconButton aria-label="menu" className="menu-button" onClick={() => setChartType({ ...chartTye, requestStatusChart: 'PIE' })}>
											<PieChartIcon />
										</IconButton>
									}
									{
										chartTye.requestStatusChart == 'PIE' &&
										<IconButton aria-label="menu" className="menu-button" onClick={() => setChartType({ ...chartTye, requestStatusChart: 'BAR' })}>
											<BarChartIcon />
										</IconButton>
									}
									<Item style={{ height: 'calc(100% - 30px)' }}>
										{
											chartTye.requestStatusChart == 'BAR' &&
											<Bar options={statusOptions} data={statusData} />
										}
										{
											chartTye.requestStatusChart == 'PIE' &&
											<Pie options={statusOptions} data={statusData} />
										}
									</Item>
								</Grid>
								<Grid item style={{ height: '50%' }}>
									{
										chartTye.repairTypeChart == 'BAR' &&
										<IconButton aria-label="menu" className="menu-button" onClick={() => setChartType({ ...chartTye, repairTypeChart: 'PIE' })}>
											<PieChartIcon />
										</IconButton>
									}
									{
										chartTye.repairTypeChart == 'PIE' &&
										<IconButton aria-label="menu" className="menu-button" onClick={() => setChartType({ ...chartTye, repairTypeChart: 'BAR' })}>
											<BarChartIcon />
										</IconButton>
									}
									<Item style={{ height: 'calc(100% - 30px)' }}>
										{
											chartTye.repairTypeChart == 'BAR' &&
											<Bar options={repairTypeOptions} data={repairTypeData} />
										}
										{
											chartTye.repairTypeChart == 'PIE' &&
											<Pie options={repairTypeOptions} data={repairTypeData} />
										}
									</Item>
								</Grid>
							</Grid>
						</div>
					</Pane>
					<Pane minSize={50} maxSize='80%'>
						<SplitPane
							split='horizontal'
							sizes={middleHorizontalSize}
							onChange={setMiddleHorizontalSize}
							onDragStart={(e) => setResizing(true)}
							onDragEnd={(e) => setResizing(false)}

						>
							<div className="my-map-container" id="my-map-container"
								style={{ width: '100%', height: '100%' }}
							>
								{
									resizing === false &&
									<div
										style={{ width: `${verticalSizes[1]}px`, height: `${middleHorizontalSize[0]}px` }}

									>
										{/*<div style={{ display: 'flex' }}>
									<h1>Calgary Pavement Cracks Map: Number of points ({points.length})
										<IconButton color="primary" aria-label="filter" component="label" onClick={() => { setOpenFilters(true) }}>
											<FilterListIcon />
										</IconButton>
									</h1>
								</div>
								
									loading === true &&
									<Skeleton variant="rounded" height={300} />
							*/}
										<MapContainer
											style={{ height: "100%", width: '100%' }}
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
													return (
														<Marker
															icon={customIcon}
															key={index}
															position={[point.latitude, point.longitude]}
															title={''}
														>
															<Popup>
																<List>
																	{/*src={`${apiUrl}/media/pavement${point.image}`}*/}

																	{
																		point.processed_image &&
																		<img
																			src={`data:image/png;base64, ${point.processed_image}`}
																			style={{ width: '100%' }}
																			srcSet={`${point.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
																			alt={point.time}
																			loading="lazy"
																		/>
																	}
																	<ListItem style={{ paddingLeft: 0 }}>
																		<b>Latitude: </b> {point.latitude}
																	</ListItem>
																	<ListItem >
																		<b>Longitude: </b> {point.longitude}
																	</ListItem>
																	<ListItem style={{ overflowX: 'hidden' }} >
																		<b>Longitudinal: </b> {point.D00}
																	</ListItem>
																	<ListItem >
																		<b>Lateral: </b> {point.D10}
																	</ListItem>
																	<ListItem >
																		<b>Alligator Crack: </b> {point.D20}
																	</ListItem>
																	<ListItem >
																		<b>Other Corruption: </b> {point.D40}
																	</ListItem>
																	<ListItem >
																		<b>Severity: </b> {point.severity}
																	</ListItem>

																</List>
															</Popup>
														</Marker>
													)
												})}
											</MarkerClusterGroup>
										</MapContainer>
									</div>
								}
							</div>


							<div style={{ ...layoutCSS, background: 'white' }}>
								<Bar options={requestPerDayOptions} data={requestPerDayData} />
							</div>
						</SplitPane>
					</Pane>
					<Pane minSize={150} maxSize='50%'>
						<div style={{ ...layoutCSS, background: 'white', textAlign: 'center', display: 'block', width: '100%', height: '100%', }}>

							<CustomTabPanel value={value} index={0}>
								<b>Total Point:</b>

								<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
									<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
										<Tab label="Requests" {...a11yProps(0)} />
										<Tab label="Planning" {...a11yProps(1)} />
									</Tabs>
								</Box>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
									height="100"
								>
									<Box
										textAlign="center"
										display="flex"
										alignItems="center"
									>
										<Icon component={TaskIcon} fontSize="large" />
										<Typography variant="h3" style={{ marginLeft: '10px', }}>
											{points.length}
										</Typography>
									</Box>
								</Box>


								<Divider />
								<List sx={{ height: '100%', bgcolor: 'background.paper', overflowY: 'auto' }}>
									{
										points.map((point, index) => {

											return (
												<ListItem alignItems="flex-start" key={index}>
													{/*
											
											<ListItemAvatar>
												<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
											</ListItemAvatar>
											*/}
													<ListItemText
														primary={<b>{point.time}</b>}
														secondary={
															<React.Fragment>
																<Typography
																	sx={{ display: 'inline' }}
																	component="span"
																	variant="body2"
																	color="text.primary"
																>
																	<b>Severity:</b> {statusLabels[point.severity]} <br />
																</Typography>
																{point.latitude}, {point.longitude}
															</React.Fragment>
														}
													/>
												</ListItem>

											)

										})
									}
									<Divider variant="inset" component="li" />
								</List>
							</CustomTabPanel>
							<CustomTabPanel value={value} index={1}>
								<b>Total Cost:</b>

								<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
									<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
										<Tab label="Requests" {...a11yProps(0)} />
										<Tab label="Planning" {...a11yProps(1)} />
									</Tabs>
								</Box>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
									height="100"
								>
									<Box
										textAlign="center"
										display="flex"
										alignItems="center"
									>
										<Icon component={AttachMoneyIcon} fontSize="large" />
										<Typography variant="h3" style={{ marginLeft: '10px' }}>
											{planning.total_cost ? planning.total_cost : 0}
										</Typography>
									</Box>
								</Box>
								<Divider />
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 700 }} aria-label="customized table">
										<TableHead>
											<TableRow>
												<StyledTableCell>Area</StyledTableCell>
												<StyledTableCell align="center">Longitudinal</StyledTableCell>
												<StyledTableCell align="center">Lateral</StyledTableCell>
												<StyledTableCell align="center">Alligator Crack</StyledTableCell>
												<StyledTableCell align="center">Other Corruption</StyledTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												planning.pavement_type &&
												Object.keys(planning.pavement_type).map((index, key) => {
													const keys = planning.pavement_type[index]
													return (
														<StyledTableRow key={key}>
															<StyledTableCell component="th" scope="row">
																{index}
															</StyledTableCell>
															<StyledTableCell align="center">{keys.includes(0) == true ? <CheckIcon /> : <CloseIcon />}</StyledTableCell>
															<StyledTableCell align="center">{keys.includes(1) == true ? <CheckIcon /> : <CloseIcon />}</StyledTableCell>
															<StyledTableCell align="center">{keys.includes(2) == true ? <CheckIcon /> : <CloseIcon />}</StyledTableCell>
															<StyledTableCell align="center">{keys.includes(3) == true ? <CheckIcon /> : <CloseIcon />}</StyledTableCell>
														</StyledTableRow>
													)
												})
											}
										</TableBody>
									</Table>
								</TableContainer>

							</CustomTabPanel>

						</div>
					</Pane>
				</SplitPane>
			</div>

		</React.Fragment>
	);
}

export default App;
