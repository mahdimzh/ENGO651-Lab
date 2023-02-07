import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Comments from './comments'
import { useDataProvider } from 'react-admin';
import FilterListIcon from '@mui/icons-material/FilterList';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
// import { dataProvider } from './dataProvider'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function Books() {
  const dataProvider = useDataProvider();
  const [openComments, setOpenComments] = React.useState(false);
  const [openFilters, setOpenFilters] = React.useState(false);
  const [bookId, setBookId] = React.useState(0);
  
  const [filters, setFilters] = React.useState({
    isbn: '',
    title: '',
    author: '',
  });
  const [books, setBooks] = React.useState([]);


  const handleClickOpenComments = (book_id) => {
    setBookId(book_id)
    setOpenComments(true);
  };

  const handleCloseComments = () => {
    setBookId(0)
    setOpenComments(false);
  };

  const handleDeleteFilter = (filter : string) => {
    setFilters({...filters, [filter]: ''})
    setOpenFilters(true)

  }

  const reload = () => {
    dataProvider.getList('books', {
      pagination: { page: 0, perPage: 0 },
      sort: { field: '', order: '' },
      filter: filters,
    }).then(res => setBooks(res.data as []))

    setOpenFilters(false)
  }

  // React.useEffect(() => {
  //   if (bookList.data !== undefined) {
  //     setBooks(bookList.data as [])
  //   }
  // }, [bookList.data]);

  return (
    <React.Fragment>
      <Comments
        bookId={bookId}
        open={openComments}
        handleClose={() => handleCloseComments()}
      />
      <Drawer
        anchor={'right'}
        open={openFilters}
        onClose={() => setOpenFilters(false)}
      >

        <Box sx={{ width: 200, maxWidth: 360, bgcolor: 'background.paper', paddingLeft: 2, paddingRight: 2 }}>
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <TextField id="standard-basic" label="ISBN" variant="standard" value={filters.isbn} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, isbn: event.target.value })} />
              </ListItem>
            </List>
          </nav>
          <Divider />
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <TextField id="standard-basic" label="Name" variant="standard" value={filters.title} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, title: event.target.value })} />
              </ListItem>
            </List>
          </nav>
          <Divider />
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <TextField id="standard-basic" label="Author" variant="standard" value={filters.author} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, author: event.target.value })} />
              </ListItem>
            </List>
          </nav>
          <Divider />

          <nav aria-label="main mailbox folders">
            <List >
              <ListItem disablePadding style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => reload()} disabled={filters.author == '' && filters.title == '' && filters.isbn == ''}>Search</Button>
              </ListItem>
            </List>

          </nav>

        </Box>

      </Drawer>

      <div>
        <IconButton color="primary" aria-label="filter" component="label" onClick={() => setOpenFilters(true)}>
          <FilterListIcon />
        </IconButton>
        <Stack direction="row" spacing={1} style={{padding: 5}}>
          {
            filters.isbn &&
            <Chip label={`Isbn: ${filters.isbn}`} onDelete={() => handleDeleteFilter('isbn')} />
          }
          {
            filters.title &&
            <Chip label={`Title: ${filters.title}`} onDelete={() => handleDeleteFilter('title')} />
          }
          {
            filters.author &&
            <Chip label={`Author: ${filters.author}`} onDelete={() => handleDeleteFilter('author')} />
          }

        </Stack>

      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell >Isbn</TableCell>
              <TableCell >Name</TableCell>
              <TableCell >Author</TableCell>
              <TableCell >Year</TableCell>
              <TableCell >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((row: any, i: number) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell >{i + 1}</TableCell>
                <TableCell>{row.isbn}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell >
                  <IconButton color="primary" component="label" onClick={() => handleClickOpenComments(row.id)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}