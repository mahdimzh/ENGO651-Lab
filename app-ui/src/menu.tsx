import { Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/books" primaryText="Books" leftIcon={<BookIcon />}/>
        <Menu.Item to="/building-permits" primaryText="Building Permits" leftIcon={<ApartmentIcon />}/>
        <Menu.Item to="/map-layer" primaryText="Map Layer" leftIcon={<DynamicFeedIcon />}/>
    </Menu>
);