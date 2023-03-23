import React from "react";
import Paho from 'paho-mqtt';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Highlight from 'react-highlight'
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
	const snackBar = {
		text: '',
		severity: 'info',
		open: false
	}
	const [openSnackBar, setOpenSnackBar] = React.useState(snackBar);

	const [reconnect, setReconnect] = React.useState(false);
	const [connected, setCnnected] = React.useState(false);

	const showLocationOnMapTopic = 'ENGO651/mahdi/my_temperature'
	const [currentLocation, setCurrentLocation] = React.useState<any>(undefined);

	const customIcon = new L.Icon({
		iconUrl: currentLocation !== undefined ? (
			currentLocation.temperture < 10 ? './location-blue.svg' :
				(currentLocation.temperture > 30 ? './location.svg' : './location-green.svg')
		) : './location.svg',
		iconSize: new L.Point(40, 47)
	});


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

	const [client, setClient] = React.useState<any>(undefined);
	const [createConnectionOpen, setCreateConnectionOpen] = React.useState(false);
	const initMessage = {
		topic: '',
		payload: '',
	}
	const [message, setMessage] = React.useState(initMessage);
	const [subscriptions, setSubscriptions] = React.useState<Array<any>>([]);
	const [topic, setTopic] = React.useState('');
	const [receivedMessages, setReceivedMessages] = React.useState<Array<any>>([]);


	const handleClickcreateConnectionOpen = () => {
		setCreateConnectionOpen(true);
	};

	const handleCloseCreateConnection = () => {
		setCreateConnectionOpen(false);
		setConnection(initConnection)
	};

	const clientConnected = () => client !== undefined && connected


	const createConnection = (host: any, port: any, clientId: any, path: any, onConnectionLost: any, onMessageArrived: any) => {
		const c = new Paho.Client(host, Number(port), path, clientId + "-" + Math.random());
		// set callback handlers
		c.onConnectionLost = onConnectionLost;
		c.onMessageArrived = onMessageArrived;

		setClient(c)
	}

	const removeConnection = () => {
		try {
			client.disconnect()
		} catch (error) { }

		setClient(undefined)
		setTopic('')
		setMessage(initMessage)
		setSubscriptions([])
		setReceivedMessages([])
		setCurrentLocation(undefined)
		setCnnected(false)
	}


	const handleConnectionLost = (e: any) => {
		console.error('disconnected')

		setCnnected(false)

		//setClient(undefined)   
		if (reconnect) {
			handleOpenSnackBar('Connection loss. Try to reconnect...', 'info')
			connect()
		}
	}

	const handleMessageArrived = (e: any) => {
		if (e.errorCode !== 0) {

			setReceivedMessages(receivedMessages => [...receivedMessages, {
				topic: e.topic,
				payload: e.payloadString,
			}])

			if (e.topic == showLocationOnMapTopic) {
				setCurrentLocation(JSON.parse(e.payloadString))
				return;
			}
		}
	}

	const initConnection = {
		host: 'test.mosquitto.org',
		port: 8081,
		clientId: 'client',
		path: '/ws',
		version: 3,
		onConnectionLost: handleConnectionLost,
		onMessageArrived: handleMessageArrived,
	}
	const [connection, setConnection] = React.useState(initConnection);

	const subscribeTopic = (topic: any) => {
		if (clientConnected()) {
			client.subscribe(topic);
		}
	}

	const unsubscribeTopic = (topic: any) => {
		if (clientConnected()) {
			client.unsubscribe(topic);
		}
	}

	const sendMessage = (topic: any, msg: any) => {
		if (clientConnected()) {
			const message = new Paho.Message(msg);
			message.destinationName = topic;
			message.qos = 0;
			message.retained = false;
			client.send(message);
			setMessage(initMessage)
		}
	}

	const onConnect = (e: any) => {
		console.info('connected')
		setCnnected(true)
	}

	const onFailure = (e: any) => {
		handleOpenSnackBar('Failed to connect. try again with different url', 'error')
		removeConnection();
	}


	const connect = () => {
		if (client === undefined) {
			createConnection(connection.host, Number(connection.port), connection.clientId, connection.path, connection.onConnectionLost, connection.onMessageArrived)
		}


		if (client !== undefined && !client.isConnected()) {
			console.info('try connecting...')
			client.connect({ onSuccess: onConnect, mqttVersion: connection.version, reconnect: true, onFailure: onFailure, useSSL: true });
			subscriptions.map(s => subscribeTopic(s))
		}
	}


	const handleSubscribeTopic = () => {
		if (clientConnected()) {
			if (!subscriptions.includes(topic)) {
				setSubscriptions(subscriptions => [...subscriptions, topic])
				subscribeTopic(topic)
			}
		}
		setTopic('')
	}

	const handleUnSubscribeTopic = (topic: any) => {
		setSubscriptions(subscriptions.filter(item => item !== topic));
		unsubscribeTopic(topic)
	}

	const getCurrentPosition = () => {
		if (navigator?.geolocation) {
			navigator.geolocation.getCurrentPosition((location) => {
				if (location) {
					setMessage({
						...message,
						payload: JSON.stringify({
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							temperture: Math.floor((Math.random() * 60) - 40),
						}),
						topic: showLocationOnMapTopic
					})
				}
			});
		}
	}


	React.useEffect(() => {
		return () => {

		};

	}, []);


	React.useEffect(() => {
		if (client !== undefined) {
			setReconnect(true)
			connect()
		}
	}, [client]);


	return (
		<React.Fragment>
			<div style={{ display: 'flex' }}>
				<h1>MTTQ:
				</h1>

			</div>
			{client !== undefined &&
				<div style={{ width: '100%', display: 'flex' }}>
					<Button variant="outlined" color="error" style={{ width: '97%' }} onClick={(e) => removeConnection()}>
						Remove Connection
					</Button>
					{
						connected === false &&
						<IconButton aria-label="Disconnected" title="Disconnected" color="error" onClick={(e) => {
							setReconnect(true)
							connect()
						}}>
							<SignalWifiOffIcon />
						</IconButton>
					}

					{
						connected &&
						<IconButton aria-label="Connected" title="Connected" color="primary" onClick={() => {
							setReconnect(false);
							client.disconnect()
						}}>
							<SignalWifiStatusbar4BarIcon />
						</IconButton>
					}
				</div>
			}
			{client === undefined &&
				<Button variant="outlined" onClick={handleClickcreateConnectionOpen}>
					Create New Connection
				</Button>

			}

			<Snackbar open={openSnackBar.open} autoHideDuration={6000} onClose={handleCloseSnackBar}>
				<Alert onClose={handleCloseSnackBar} severity={openSnackBar.severity} sx={{ width: '100%' }}>
					{openSnackBar.text}
				</Alert>
			</Snackbar>

			<Dialog open={createConnectionOpen} onClose={handleCloseCreateConnection}>
				<DialogTitle>Create New Connection</DialogTitle>
				<DialogContent>
					<DialogContentText>
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="host"
						label="Host"
						value={connection.host}
						type="text"
						fullWidth
						variant="standard"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConnection({ ...connection, host: event.target.value })}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="port"
						label="Port"
						type="number"
						value={connection.port}
						fullWidth
						variant="standard"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConnection({ ...connection, port: Number(event.target.value) })}
					/>
					
					<FormControl fullWidth style={{display: 'none'}}>
						<InputLabel id="demo-simple-select-label">Mqtt Version</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={connection.version }
							
							label="Mqtt Version"
							onChange={(event: SelectChangeEvent) => setConnection({ ...connection, version: Number(event.target.value as string) })}
							>
							<MenuItem value={3}>3</MenuItem>
							<MenuItem value={5}>5</MenuItem>
						</Select>
					</FormControl>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseCreateConnection}>Cancel</Button>
					<Button onClick={() => {
						handleCloseCreateConnection();
						createConnection(connection.host, connection.port, connection.clientId, connection.path, connection.onConnectionLost, connection.onMessageArrived)
					}
					}>Create</Button>
				</DialogActions>
			</Dialog>

			{
				client !== undefined &&
				<div >
					<Box
						component="form"
						noValidate
						autoComplete="off"
					>
						<div style={{ width: '100%', display: 'flex' }}>
							<TextField
								required
								style={{ marginRight: 10, width: '100%' }}
								id="outlined-required"
								label="Topic"
								value={message.topic}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessage({ ...message, topic: event.target.value })}
							/>
							<Button
								style={{ marginTop: 15, height: 'fit-content' }}
								variant="contained"
								disabled={message.topic == '' || message.payload == '' || connected === false}
								onClick={() => sendMessage(message.topic, message.payload)}
							>
								Send
							</Button>

							<IconButton
								aria-label="location"
								onClick={() => getCurrentPosition()}
								color="primary"
							>
								<GpsFixedIcon />
							</IconButton>

						</div>

						<div style={{ width: '100%' }}>
							<TextField
								id="outlined-multiline-static"
								label="Message"
								required
								multiline
								rows={4}
								style={{ width: '100%' }}
								value={message.payload}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessage({ ...message, payload: event.target.value })}
							/>
						</div>
					</Box>

					<MapContainer
						style={{ height: "250px" }}
						center={[51.0447, -114.0719]}
						zoom={10}
						scrollWheelZoom={true}
					>
						<TileLayer
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<MarkerClusterGroup chunkedLoading>
							{
								currentLocation !== undefined &&

								<Marker
									icon={customIcon}
									position={[currentLocation.latitude, currentLocation.longitude]}
									title='Current location'
								>
									<Popup>
										<List>
											<ListItem >
												<b>Latitude: </b> {currentLocation.latitude}
											</ListItem>
											<ListItem style={{ overflowX: 'hidden' }} >
												<b>Longitude: </b> {currentLocation.longitude}
											</ListItem>
											<ListItem >
												<b>Temperture: </b> {currentLocation.temperture}
											</ListItem>
										</List>
									</Popup>
								</Marker>
							}

						</MarkerClusterGroup>
					</MapContainer>


					<Grid container spacing={2} style={{height: '100%', overflow: 'auto', marginTop: 20}}>
						<Grid item xs={12} md={4}>
							<Item>
								<FormControl sx={{ m: 1, width: '80%' }} variant="outlined">
									<InputLabel htmlFor="">Enter a topic</InputLabel>
									<OutlinedInput
										id=""
										type='text'
										value={topic}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTopic(event.target.value)}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label=""
													edge="end"
													disabled={topic === '' || connected === false}
													onClick={handleSubscribeTopic}
												>
													<AddCircleIcon />
												</IconButton>
											</InputAdornment>
										}
										label="Topic"
									/>
								</FormControl>
								<List dense={false}>
									{
										subscriptions.map((topic, index) =>
											<ListItem
												key={index}
												secondaryAction={
													<IconButton edge="end" aria-label="delete">
														<DeleteIcon
															onClick={() => handleUnSubscribeTopic(topic)}
														/>
													</IconButton>
												}
											>
												<ListItemText
													primary={topic}
												/>
											</ListItem>)
									}
								</List>

							</Item>
						</Grid>
						<Grid item xs={12} md={8}>
							<Item>
								<List dense={true}>
									{
										receivedMessages.slice(0).reverse().map((msg, index) =>
											<ListItem
												key={index}
											>
												<ListItemText
													primary={<b>{msg.topic}:</b>}
													secondary={<Highlight className='language-name-of-snippet' >{msg.payload}</Highlight>}
												/>
											</ListItem>)
									}
								</List>
							</Item>
						</Grid>
					</Grid>
				</div>
			}
		</React.Fragment>
	);
}

export default App;
