import { Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/books" primaryText="Books" leftIcon={<BookIcon />}/>
    </Menu>
);