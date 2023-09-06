import * as React from "react";
import { Layout } from 'react-admin';
import { MyMenu } from './menu';
import { AppBar, Button } from 'react-admin';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import { useGlobal } from './App';
import UploadIcon from '@mui/icons-material/Upload';
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";


const CustomAppBar = (props) => {
    const location = useLocation();
    const shouldShowRefreshButton = location.pathname === '/pavement-cracks';
    const { flag, setFlag } = useGlobal();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log(file)

    };

    return (
        <AppBar {...props}>
            <div style={{ width: '100%', textAlign: 'right' }}>
                {shouldShowRefreshButton &&

                    <React.Fragment>
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            style={{ color: 'white' }}
                        >
                            <input hidden accept="image/*" type="file" onChange={handleFileUpload}/>
                            <UploadIcon />
                        </IconButton>
                    </React.Fragment>
                }

                {shouldShowRefreshButton && (
                    <IconButton style={{ color: 'white' }} aria-label="filter" component="label" onClick={() => setFlag(!flag)} >
                        <FilterListIcon />
                    </IconButton>)}



            </div>
        </AppBar>
    );
};

export const MyLayout = props => <Layout appBar={CustomAppBar}  {...props} menu={MyMenu} />;
