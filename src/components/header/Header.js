import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// Components
import Search from '../search/Search'
// material ui
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { Nav, Navbar } from 'react-bootstrap'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import BarChartIcon from '@material-ui/icons/BarChart'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
// Cloudinary
import { Image } from 'cloudinary-react'
// Css
import './style.css'

const useStyles = makeStyles((theme) => ({
  searchLink: {
    [theme.breakpoints.up('md')]: {
      margin:'0px 70px',
      width: 'auto',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    },
    marginRight:'35%'
  },
  helloUser: {
    margin:'auto 15px',
    width: '165px',
    fontWeight:'600',
    color:'black',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
}))

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [username, setUsername] = useState(user.username)
  const classes = useStyles()

  return (
    <div className={classes.grow}>
    
        <div className="container-fluid bg-white nav-fill w-100">
          <div className="container">
            <Navbar bg="white" expand="md" className="navbar">
              <Navbar.Brand style={{height:'40px'}}>
                <Link to="/" style={{ textDecoration: 'none', marginRight:'25%'}}>
                  <Typography className={classes.title} variant="h6" noWrap>
                    <Image cloudName="malachcloud" src="https://res.cloudinary.com/malachcloud/image/upload/v1618384622/summer-hot-vacation-logo-illustration-art-isolated-background-91286774_syvpkz.jpg" width="70" height="40" crop="scale" />
                  </Typography>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle/>
              <Navbar.Collapse className="navbar_collapse" id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <div className={classes.searchLink}>  <Search/> </div>
                  <div className={classes.helloUser}>  Hello {username} </div>
                  <Nav.Link> 
                    <Link to="/" style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
                      <IconButton color="inherit">
                        <HomeIcon/> <span className="link_desc">Home</span>
                      </IconButton>
                    </Link>
                  </Nav.Link>
                  <Nav.Link> 
                    {user.admin && 
                        <Link to="/chart" style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
                        <IconButton color="inherit">
                        <BarChartIcon/> <span className="link_desc">Chart</span>
                        </IconButton>
                        </Link>
                        }
                  </Nav.Link>
                  <Nav.Link> 
                    <Link to="/logout" style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
                      <IconButton color="inherit">
                        <ExitToAppIcon/> <span className="link_desc">Logout</span>
                      </IconButton>
                    </Link>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
          </Navbar>
      </div>
    </div>
  </div> 
  )
}
export default Header
