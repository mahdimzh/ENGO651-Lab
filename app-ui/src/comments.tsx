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
import Rating from '@mui/material/Rating';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [rating, setRating] = React.useState<number | null>(null);

  // const [filters, setFilters] = React.useState({
  //   book_id: 0,
  // });

  const [comments, setComments] = React.useState([]);

  const [comment, setComment] = React.useState('')
  const [googleReview, setGoogleReview] = React.useState(null)

  const resetForm = () => {
    setComment('')
    setGoogleReview(null)
    setRating(0)

  }
  const submitComment = () => {
    return dataProvider.create('comments/', {
      data: { book: props.book.id, user: localStorage.getItem("user_id"), comment: comment, rating: rating }
    })
      .then(
        (data) => {
          notify('Submited Successfully')
          resetForm()
          reload()

        },
        (error: any) => {
          notify('This user has submited comment before')

        }
      )
      .catch((error: any) => {
        notify('This user has submited comment before')
      })

  }

  const reload = () => {
    dataProvider.getList('comments', {
      pagination: { page: 0, perPage: 0 },
      sort: { field: '', order: '' },
      filter: { book_id: props.book.id },
    }).then(res => setComments(res.data as []))

    dataProvider.getList('comments/get_book_info_from_google', {
      pagination: { page: 0, perPage: 0 },
      sort: { field: '', order: '' },
      filter: { isbn: props.book.isbn },
    }).then(res => setGoogleReview(res.data[0] !== undefined ? res.data[0] : null))


  }

  React.useEffect(() => {
    // reload()

    return () => {
      setComments([])
    };
  }, []);

  React.useEffect(() => {
    if (props.open === true && props.book !== null) {
      resetForm()
      reload()
    }
  }, [props]);

  return (
    <div>
      <Dialog
        // fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"

      >
        <DialogTitle id="scroll-dialog-title" style={{ padding: 0 }}>
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

        </DialogTitle>

        <DialogContent dividers={true}>

          <Grid container spacing={2} style={{ textAlign: 'center', width: '100%' }}>
            {props.book &&
              <Grid xs={12}>
                <b>Book details:</b>
                <Grid container style={{ textAlign: 'left', marginTop: 5 }}>
                  <Grid xs={6}>
                    <b>ISBN:</b> {props.book.isbn}
                  </Grid>
                  <Grid xs={6}>
                    <b>Title:</b> {props.book.title}
                  </Grid>
                  <Grid xs={6}>
                    <b>Author:</b> {props.book.author}
                  </Grid>
                  <Grid xs={6}>
                    <b>Year:</b> {props.book.year}
                  </Grid>
                  <Grid xs={12} style={{ textAlign: 'center', marginTop: 5 }}>
                    <Divider />
                    <b>Info from Google API...</b>

                    {
                      googleReview !== null && googleReview.totalItems > 0 &&
                      googleReview.items.map((item: any, i: number) => (
                        <List sx={{ width: '100%', bgcolor: 'background.paper', textAlign: 'left' }}>
                          <Grid container spacing={2} style={{ margin: 0, marginTop: 5 }}>
                            <Grid xs={6}>
                              <b>Average Rating:</b> {item.volumeInfo.averageRating}
                            </Grid>
                            <Grid xs={6}>
                              <b>Rating Count:</b> {item.volumeInfo.ratingsCount}
                            </Grid>
                          </Grid>
                        </List>
                      ))
                    }
                    {
                      (googleReview === null || googleReview.totalItems == 0) &&
                      <div style={{ textAlign: 'center', marginTop: 5 }}>
                        No more information
                      </div>
                    }
                  </Grid>
                </Grid>
                <Divider />

              </Grid>
            }
            <Grid xs={12}>
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

            </Grid>
            <Grid xs={12}>
              <Rating
                name="simple-controlled"
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />

            </Grid>
            <Grid xs={12}>
              <Button variant="contained" disabled={comment === ''} onClick={() => submitComment()}>Submit</Button>
            </Grid>

            <Divider />

            <Grid item xs={12}>

              <Divider />
              <div style={{ textAlign: 'left', fontWeight: 'bold', marginTop: 5 }}>
                Other Comments...
              </div>
              {comments.map((comment: any, i: number) => (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={comment.username} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                          >
                            {comment.username}
                            <Rating name="read-only" value={comment.rating} readOnly precision={0.5} />
                          </Typography>
                        </React.Fragment>
                      }
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
            </Grid>


          </Grid>
        </DialogContent>

      </Dialog>
    </div>
  );
}
