// in src/App.tsx
// import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { UserList } from "./users";
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { Route } from "react-router-dom";
import Register from './register'
import Books from './book/books'
import BuildingPermit from './building-permit'
import MapLayer from './map-layer'
import PahoMqtt from './paho-mqtt'
import { MyLayout } from './layout';
import Login from './login'

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');


const App = () => ( 
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    authProvider={authProvider}
    layout={MyLayout}
    loginPage={Login}
  >
    <Resource name="users" list={UserList} />
    <CustomRoutes>
      <Route path="/books" element={<Books />} />
    </CustomRoutes>
    <CustomRoutes noLayout>
      <Route path="/register" element={<Register />} />
    </CustomRoutes>
    <CustomRoutes>
      <Route path="/building-permits" element={<BuildingPermit />} />
    </CustomRoutes>
    <CustomRoutes>
      <Route path="/map-layer" element={<MapLayer />} />
    </CustomRoutes>
    <CustomRoutes>
      <Route path="/paho-mqtt" element={<PahoMqtt />} />
    </CustomRoutes>


    
  </Admin>
);

export default App;
