import React, { useState, useEffect } from 'react'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setVacationsState } from '../../store/actions'
// Components
import Poper from './poper/Poper'
// Material ui
import { makeStyles } from '@material-ui/core/styles'
import { Button, InputBase, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
// Dates
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
// Css
import './style.css'

const useStyles = makeStyles((theme) => ({
    search: {
      display: 'flex',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: 'whitesmoke',
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      width: '348px !important',
      // width: 'auto',
      color:'black',
      margin: '10px 0px',
      [theme.breakpoints.up('md')]: {
        width: 'auto !important',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'right',
    },
    inputRoot: {
      color: 'inherit',
      fontSize: '13px'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sortBtn: {
      padding:'0px 8px 8px'
    }
   
    
  }))

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const [searchBy, setSearchBy] = useState('General')
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()
    const vacations = useSelector(state => state.vacations.data)
    const classes = useStyles()
    const open = Boolean(anchorEl)
  
    const handleClick = (e) => open ? setAnchorEl(null) : setAnchorEl(e.currentTarget)
    const handleStartDateChange = (date) => setSelectedStartDate(date)
    const handleEndDateChange = (date) => setSelectedEndDate(date)
    const clearInput = () => {
      setSearchValue('')
      if(searchBy === 'Dates') {
        setSelectedStartDate(new Date())
        setSelectedEndDate(new Date())
        bringAllVacation()
    }
  }

    const bringAllVacation = async () => {
      const res = await fetch(`https://vacationweb.herokuapp.com/vacation`)
      const { vacations } = await res.json()
      vacations.forEach(vacation => Boolean(vacation.Follows.find(follow => Number(follow.UserId) === Number(user.id))) ? vacation.isFollow = true : vacation.isFollow = false)
      vacations.sort((x, y) =>  x.isFollow - y.isFollow).reverse()
      dispatch(setVacationsState(vacations))
    }

    const findVacations = async () => {
      let value = ''
      if(searchBy === 'Dates') value = { startDate:selectedStartDate, endDate: selectedEndDate }
      else value = searchValue
      const searchObj = { value, type:searchBy }
      const res = await fetch(`https://vacationweb.herokuapp.com/vacation/search/${JSON.stringify(searchObj)}`)
      const { vacations } = await res.json()
      vacations.forEach(vacation => Boolean(vacation.Follows.find(follow => Number(follow.UserId) === Number(user.id))) ? vacation.isFollow = true : vacation.isFollow = false)
      vacations.sort((x, y) => {
        if (x.isFollow === y.isFollow) return 0
        if (x.isFollow)  return -1
        if (y.isFollow) return 1
        return 0
      })
      dispatch(setVacationsState(vacations))
    }
 
    useEffect(() => {
      if(searchBy === 'Dates') {
        if(!(
          (selectedStartDate.getDate() === new Date().getDate() && selectedStartDate.getMonth() === new Date().getMonth())
           && (selectedEndDate.getDate() === new Date().getDate() && selectedEndDate.getMonth() === new Date().getMonth()))){
          findVacations()
        } else {
          console.log('not searching');
        }
      } else {
        findVacations()
      }
    }, [searchValue, searchBy, selectedStartDate, selectedEndDate])

    useEffect(() => {
      setSearchValue('')
    },[searchBy])

    return (
        <>

           <div className={classes.search} id='stepFour'>
            <div className={classes.searchIcon}>
             { searchBy !== 'Dates' ? <SearchIcon/> : null }
            </div>
            {searchBy === 'Dates' ? 
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                label="start date"
                format="dd/MM/yyyy"
                value={selectedStartDate}
                onChange={handleStartDateChange}
              />
              <KeyboardDatePicker
              label="end date"
            
                format="dd/MM/yyyy"
                value={selectedEndDate}
                onChange={handleEndDateChange}
              />
          </MuiPickersUtilsProvider>
         :
         
            <InputBase
              type='text'
              value={searchValue}
              onChange={e =>  setSearchValue(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
            }
            <div className="sort_btn_div">
              <span className="sort_span">search by</span>
              <Button className={classes.sortBtn} onClick={handleClick}> {searchBy} </Button> 
            </div>
           <IconButton onClick={() => clearInput() }> <ClearIcon fontSize="small"/> </IconButton> 
           <Poper vacations={vacations} open={open} anchorEl={anchorEl} setAnchorEl={setAnchorEl} setSearchBy={setSearchBy} />
          </div>
        </>
    )
}

export default Search
