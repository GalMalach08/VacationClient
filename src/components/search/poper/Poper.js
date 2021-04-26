import React from 'react'
// Material ui
import { makeStyles } from '@material-ui/core/styles'
import { Popper, Button } from '@material-ui/core'
// Css
import './style.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin:'16px',
    border: '1px solid lightgrey',
    padding: theme.spacing(1),
    backgroundColor: 'white',
  },
  divider: {
    background:'black'
  }
}))


 const SimplePopper = ({ vacations, anchorEl, open, setAnchorEl, setSearchBy }) => {
  const classes = useStyles()

  const setSearchType = (value) => {
    setSearchBy(value)
    setAnchorEl(null)
  }
  return (
    <div>
      <Popper  className={classes.paper} open={open} anchorEl={anchorEl} style={{width:'300px'}}>
        <div className="vacationDiv">
            <Button onClick={() => setSearchType('General')}>
                <div className="sort_type">General</div>
            </Button>
        </div>
        <div className="vacationDiv">
          <Button onClick={() => setSearchType('Dates')}> 
              <div className="sort_type">Dates</div>
          </Button>
        </div>
        <div className="vacationDiv">
          <Button 
           onClick={() => setSearchType('description')}>
              <div className="sort_type">Description</div>
          </Button>
        </div>
        <div className="vacationDiv">
            <Button  onClick={() => setSearchType('destination')}>
                <div className="sort_type">Destination</div>
            </Button>
        </div>
      </Popper>
    </div>
  )
}
export default SimplePopper