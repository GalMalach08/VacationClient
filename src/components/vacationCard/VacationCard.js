import React from 'react'
// Material ui
import { Divider, IconButton, Card, CardContent, CardHeader,
CardMedia, Avatar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'  
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
// Cloudinary
import { Image } from 'cloudinary-react'

const useStyles = makeStyles(() => ({
    root: {
      display:'flex',
      justifyContent:'center',
      margin:'30px'
    },
    media: {
      height: '400px',
      width:'550px',
      paddingTop: '56.25%',
    },
    previewmedia: {
      width:'300px',
      height:'200px'
    },
    fab: {
      position:'fixed',
      bottom: '10px',
      left: '75%',
      whiteSpace: 'nowrap',
      zIndex: '50px',
      borderRadius:'20px',
      backgroundColor:'lightblue'
    },
    follow:{
      textAlign:'right'
    },
    card: {
      backgroundImage:'linear-gradient(#e6ecff, #99b3ff, #ffcccc)'
    },
    title: { 
      fontWeight:'600',
      fontSize:'16px'
    },
    divider: {
      margin:'15px 0px'
    },
  }))     
  
const VacationCard = ({ vacation, editVacation, deleteVacation, setFollow, isAdmin }) => {
    const classes = useStyles()
    return (
      <>
     { vacation.image &&
        <Card className={classes.card}>
          <CardHeader
            id='stepOne'
            avatar={ <Avatar><Image cloudName="malachcloud" src={vacation.image} width="70" height="40" crop="scale" /> </Avatar>}
            action={
            isAdmin ?
            <>
              <IconButton onClick={() => editVacation(vacation.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteVacation(vacation.id, vacation.destination)}>
                <DeleteIcon />
              </IconButton>
            </>
            :
              <IconButton id='stepThree' onClick={() => setFollow(vacation.id, vacation.isFollow)}> {vacation.isFollow ? 'Unfollow' : 'Follow' }</IconButton> 
            }
            title={<span className={classes.title}>{vacation.destination}</span>}
          />

          <CardMedia className={classes.media} image={vacation.image}></CardMedia>

          <CardContent id='stepTwo'>
            <Typography className={classes.likes}> 
              <span className="mini_title"> destination: </span>
              <span className="mini_content"> {vacation.destination} </span>
            </Typography>
            <Divider className={classes.divider}/>
            <Typography className={classes.likes}> 
              <span className="mini_title"> about: </span>
              <span className="mini_content"> {vacation.description} </span>
            </Typography>
            <Divider className={classes.divider}/>
            <Typography className={classes.likes}> 
            <span className="mini_title"> when: </span>
            <span className="mini_content"> {vacation.start_date} - {vacation.end_date} </span>
            </Typography>
            <Divider className={classes.divider}/>
            <Typography className={classes.likes}> 
            <span className="mini_title"> price: </span>
            <span className="mini_content">{vacation.price}$ for each person </span>
            </Typography>
            <Typography className={classes.follow}> 
            <span className="mini_title"> {vacation.Follows.length} Followers </span>
            </Typography>
          </CardContent>
        </Card> 
    }
    </>
    )
}

export default VacationCard
