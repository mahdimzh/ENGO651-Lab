import { Layout } from 'react-admin';

import { MyMenu } from './menu';
import { AppBar, Button } from 'react-admin';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import { useGlobal } from './App';



const CustomAppBar = (props) => {
    const location = useLocation();
    const shouldShowRefreshButton = location.pathname === '/pavement-cracks';
    const { flag, setFlag } = useGlobal();

    return (
        <AppBar {...props}>
            <div style={{ width: '100%', textAlign: 'right' }}>
                {shouldShowRefreshButton && (
                    <IconButton style={{color: 'white'}} aria-label="filter" component="label" onClick={() => setFlag(!flag)} >
                        <FilterListIcon />
                    </IconButton>)}
                {/* Add more buttons or elements here */}
            </div>
        </AppBar>
    );
};

export const MyLayout = props => <Layout appBar={CustomAppBar}  {...props} menu={MyMenu} />;
