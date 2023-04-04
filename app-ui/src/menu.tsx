import { Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import RouteIcon from '@mui/icons-material/Route';
import PolylineIcon from '@mui/icons-material/Polyline';
import AltRouteIcon from '@mui/icons-material/AltRoute';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/books" primaryText="Books" leftIcon={<BookIcon />}/>
        <Menu.Item to="/building-permits" primaryText="Building Permits" leftIcon={<ApartmentIcon />}/>
        <Menu.Item to="/map-layer" primaryText="Map Layer" leftIcon={<DynamicFeedIcon />}/>
        <Menu.Item to="/paho-mqtt" primaryText="Paho MQTTX" leftIcon={<RouteIcon />}/>
        <Menu.Item to="/turf-simplify" primaryText="Turf Simplify" leftIcon={<PolylineIcon />}/>
        <Menu.Item to="/route-recommendation" primaryText="Routing (Final Project)" leftIcon={<AltRouteIcon />}/>
    </Menu>
);


