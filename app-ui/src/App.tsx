// in src/App.tsx
// import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { UserList } from "./users";
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { Route } from "react-router-dom";
import Register from './register'
import Books from './books'
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

  </Admin>
);

export default App;
