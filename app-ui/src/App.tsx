// in src/App.tsx
// import jsonServerProvider from "ra-data-json-server";
import React, { createContext, useContext, useState } from 'react';
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
import TurfSimplify from './turf-simplify'
import { MyLayout } from './layout';
import Login from './login'
import RouteRecommendation from './route-recommendation'
import PavementCrack from './pavement-crack'


// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const GlobalContext = createContext();


const App = () => {
  const [flag, setFlag] = useState(false);


  return (
    <GlobalContext.Provider value={{ flag, setFlag }}>
      <Admin
        dataProvider={dataProvider}
        dashboard={Dashboard}
        authProvider={authProvider}
        layout={MyLayout}
        loginPage={Login}
      >
        <CustomRoutes>
          <Route path="/pavement-cracks" element={<PavementCrack />} />
        </CustomRoutes>
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
        <CustomRoutes>
          <Route path="/turf-simplify" element={<TurfSimplify />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route path="/route-recommendation" element={<RouteRecommendation />} />
        </CustomRoutes>
      </Admin>
    </GlobalContext.Provider>
  )
};

export default App;

export function useGlobal() {
  return useContext(GlobalContext);
}
