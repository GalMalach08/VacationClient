import React, { useEffect, useState } from 'react'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setVacationsState } from '../../store/actions'
// Components
import NewUserModal from './newUserModal/NewUserModal'
import EditModal from './editModal/EditModal'
import AddVacationModal from './addVacationModal/AddVacationModal'
import DeleteVacationModal from './deletevacation/DeleteVacationModal'
import VacationCard from '../vacationCard/VacationCard'
// Material ui components
import { Grid, Fab } from '@material-ui/core'
import { makeStyles, StylesProvider } from '@material-ui/core/styles'
// Material ui icons
import AddIcon  from '@material-ui/icons/Add'
// Intro js
import { Steps } from 'intro.js-react'
import 'intro.js/introjs.css'
// Css
import './style.css'

// material ui style
const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    justifyContent:'center',
    margin:'30px'
  },
  previewcard:{
    width:'300px',
    height:'340px',
    margin:'auto'
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

 const Home = () => {
  const classes = useStyles()
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  const vacations = useSelector(state => state.vacations.data)
  const [isAdmin, setIsAdmin] = useState(user ? user.admin : null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [vacationToEdit, setVacationToEdit] = useState('')
  const [addVacationModalOpen, setAddVacationModalOpen] = useState(false)
  const [deleteVacationModalOpen, setDeleteVacationModalOpen] = useState(false)
  const [vacationToDelete, setVacationToDelete] = useState('')
  const [vacationToDeleteId, setVacationToDeleteId] = useState('')
  // Intro js states
  const [firstEntry, setFirstEntry] = useState(false)
  const [stepsEnabled, setStepsEnabled] = useState(false)
  const [initialStep, setInitialStep] = useState(0)
  const [steps, setSteps] = useState([
      { element:'#stepOne', intro: 'Take a look on the vacation we offer 🥳', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepTwo', intro: 'In each card you are able to see all the details about the vacation 🥳', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepThree', intro:'Start following vacations to get them on top of your page 😎', position: 'left', tooltipClass: 'myTooltipClass' },
      { element:'#stepFour', intro: 'Try to serach for your dreamy vacation, use the "search by" tab to take more specific search 🔍', position: 'left', tooltipClass: 'myTooltipClass' },
  ])

  // Delete vacation 
  const deleteVacation = async (id,destination) => {
    try {
      setVacationToDeleteId(id)
      setVacationToDelete(destination)
      setDeleteVacationModalOpen(true)
    } catch (error) {
      console.log(error)
    }
  }
 
  // Get all the vacations
  const getVacations = async () => {
    try {
      const res = await fetch('/vacation')
      const { vacations } = await res.json()
      vacations.forEach(vacation => Boolean(vacation.Follows.find(follow => Number(follow.UserId) === Number(user.id))) ? vacation.isFollow = true : vacation.isFollow = false)
      vacations.sort((x, y) =>  x.isFollow - y.isFollow).reverse()
      dispatch(setVacationsState(vacations))
    } catch(err) {
      console.log(err)
    }
  }

  // Set follow state
  const setFollow = async (VacationId, isFollow) => {
    try {
        if(!isFollow) { // if the user not following - make follow
          const response = await fetch('/follow', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ VacationId, UserId:user.id })
            })
            const { follow } = await response.json()
            if(follow) {
              const vacation = vacations.find(vacation => vacation.id === VacationId)
              vacation.isFollow = true
              vacation.Follows.push({ UserId: user.id, VacationId })
              dispatch(setVacationsState(vacations))
            }
        } else {
          const response = await fetch('/follow/unfollow', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ VacationId, UserId:user.id })
            })
            const { follow } = await response.json()
            if(follow) {
              const vacation = vacations.find(vacation => vacation.id === VacationId)
              vacation.isFollow = false
              vacation.Follows = vacation.Follows.filter(follow => !(follow.UserId ===  user.id && follow.VacationId === VacationId))
              dispatch(setVacationsState(vacations))
            }
        }
      } catch(err) {
        console.log(err)
      }
  }

  // Edit vacation
  const editVacation = (id) => {
    setVacationToEdit(id)
    setEditModalOpen(true)
  }
 
  // intro js functions
  const onExit = () => {
    setStepsEnabled(false)
    setFirstEntry(false)
  }

  // Trigger on component load
  useEffect(() => {
   getVacations()
   if (user.newUser) {
    setFirstEntry(true)
    delete user['newUser']
    localStorage.setItem('user', JSON.stringify(user))
   }
  }, [])

  return (
    <>
      {firstEntry ? 
      <>
      <NewUserModal stepsEnabled={stepsEnabled} setStepsEnabled={setStepsEnabled}/>
      <Steps enabled={stepsEnabled} steps={steps} initialStep={initialStep} onExit={onExit}/>
     </>
      : null}
      <StylesProvider injectFirst>
      <div className="container">
        <Grid container>
            {vacations ? 
            vacations.length !== 0 ?  vacations.map(vacation => (
              <Grid item xs={11} lg={5} key={vacation.id}  className={classes.root}>
                <VacationCard vacation={vacation} editVacation={editVacation} 
                deleteVacation={deleteVacation} setFollow={setFollow} isAdmin={isAdmin} />
              </Grid>
            )): null :  null  }

          {/* Fab */}
          {user.admin && <Fab color="primary"  className={classes.fab} onClick={() => setAddVacationModalOpen(true)} title="Add new vacation"> 
              <AddIcon />
            </Fab> } 
          {/* Modals */}
          { addVacationModalOpen && <AddVacationModal addVacationModalOpen={addVacationModalOpen} setAddVacationModalOpen={setAddVacationModalOpen} />}
          { vacationToEdit && <EditModal setEditModalOpen={setEditModalOpen} editModalOpen={editModalOpen} vacationToEdit={vacationToEdit}/> }
          { deleteVacationModalOpen && <DeleteVacationModal deleteVacationModalOpen={deleteVacationModalOpen} setDeleteVacationModalOpen={setDeleteVacationModalOpen} vacationName={vacationToDelete} id={vacationToDeleteId}/> }
        </Grid>
      </div>
    </StylesProvider>
  </>
  )
}
export default Home
