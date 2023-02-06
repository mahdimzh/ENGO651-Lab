import { Layout } from 'react-admin';

import { MyMenu } from './menu';

export const MyLayout = props => <Layout {...props} menu={MyMenu} />;
