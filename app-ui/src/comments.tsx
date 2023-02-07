import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { dataProvider } from './dataProvider'
import { useNotify } from 'react-admin';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Comments(props: any) {
  const notify = useNotify();
  
  // const [filters, setFilters] = React.useState({
  //   book_id: 0,
  // });

  const [comments, setComments] = React.useState([]);

  const [comment, setComment] = React.useState('')

  const submitComment = () => {
    return dataProvider.create('comments/', {
      data: { book: props.bookId, user: localStorage.getItem("user_id"), comment: comment }
    })
      .then(
        (data) => {
          notify('Submited Successfully')
          setComment('')
          reload()

        },
        (error: any) => {
          notify('An Error Happen')

        }
      )
      .catch((error: any) => {
        notify('An Error Happen')
      })

  }

  const reload = () => {
    dataProvider.getList('comments', {
      pagination: { page: 0, perPage: 0 },
      sort: { field: '', order: '' },
      filter: {book_id: props.bookId},
    }).then(res => setComments(res.data as []))
  }

  React.useEffect(() => {
    // reload()

    return () => {
      setComments([])
    };
  }, []);

  React.useEffect(() => {
    console.log(props)
    if(props.open === true && props.bookId !== 0) {
      reload()
    }
  }, [props]);

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Comments
            </Typography>
            {/** 
            <Button autoFocus color="inherit" onClick={props.handleClose}>
              save
            </Button>
            */}
          </Toolbar>
        </AppBar>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <TextField
                id="filled-multiline-static"
                label="Add your comment"
                multiline
                value={comment}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComment(event.target.value)}
                rows={4}
                style={{ width: '100%' }}
                // defaultValue=""
                variant="filled"
              />

              <Button variant="contained" onClick={() => submitComment()}>Submit</Button>

            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
                Other Comments...
              </div>
              {comments.map((comment: any, i: number) => (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={comment.username} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.username}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.comment}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </List>
              ))}
            </Item>
          </Grid>
        </Grid>

      </Dialog>
    </div>
  );
}
