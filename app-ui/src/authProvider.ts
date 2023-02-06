import { dataProvider } from './dataProvider'

// in src/authProvider.ts
export const authProvider = {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    return dataProvider.create('auth/login/', {
      data: { username, password }
    })
      .then(
        ({data}) => {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);
            return Promise.resolve()
        },
        (error: any) => {
          const { response } = error
          return Promise.reject(response.data !== undefined && response.data.detail !== undefined ? response.data.detail : "An error happen");
        }
      )
      .catch((error: any) => {
        console.error('Error :', error);
        return Promise.reject(error);
      })
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.clear();
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("access");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("access")
      ? Promise.resolve()
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
