import * as React from 'react';
import { Card, CardContent, CardHeader } from "@mui/material";
import { useDataProvider } from 'react-admin';

export function Dashboard() {
  const dataProvider = useDataProvider();
 

  React.useEffect(() => {
    if (localStorage.getItem('user_id')) {
      dataProvider.getOne('user', { id: localStorage.getItem('user_id') })

    }

  }, []);

  return (
    <Card>
      <CardHeader title="A platform to learn about books" />
      <CardContent>Start reading...</CardContent>
    </Card>
  )
}
