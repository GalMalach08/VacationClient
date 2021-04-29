import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateVacations } from '../../../store/actions'
// material ui
import { makeStyles } from '@material-ui/core/styles';
import { Input, Button, TextField, Grid, Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import ImageIcon from '@material-ui/icons/Image'
import Alert from '@material-ui/lab/Alert'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// React toastify 
import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// bootstrap 
import Modal from 'react-bootstrap/Modal'
// Formik
import { Formik } from 'formik'
import * as Yup from 'yup'
// Css
import './style.css'
// momentjs 
const moment = require('moment')


const useStyles = makeStyles(() => ({
  root: {
    overflowY:'auto',
    paddingTop:'180px',
    marginTop:'80px',
    maxHeight:'500px'
  }
}))
const EditModal = ({ editModalOpen ,setEditModalOpen, vacationToEdit })  =>  {
    const [initialValues, setInitialValues] = useState('')
    const [imageName, setImageName] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const dispatch = useDispatch()
    const vacations = useSelector(state => state.vacations.data)
    const classes = useStyles()

    // Formik
    const validationSchema = Yup.object().shape({
      description:Yup.string()
      .required('description is required')
      .min(6, 'That it? write some more(min 6 characters)'),
      destination:Yup.string()
      .required('destination is required'),
       image:Yup.string()
      .required('image is required'),
      price:Yup.string()
      .required('price is required'),
    })
    const errorHelper = (formik,values) => ({
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })

  // Toastify
  const successToast = (message) => {
    toast(message, { 
     draggable: true, 
     position: toast.POSITION.BOTTOM_RIGHT,
     transition: Zoom,
     autoClose: 2000
    })
  }
 
    // Handle the dates state
    const handleStartDateChange = (date) => setSelectedStartDate(date)
    const handleEndDateChange = (date) => setSelectedEndDate(date)
    
    // Close the modal
    const handleClose = () => {
      setEditModalOpen(false)
      setInitialValues({description:'', destination:'', start_date:'', end_date:'', price:''})
    }
     
    // Handle image change  
    const handleChangeImage = (e,setFieldValue) => {
      const reader = new FileReader()
      setFieldValue('image', e.target.files[0])
      if(e.target.files.length === 0) {
      setImageName('')
      setFieldValue('image','')
      } 
      else {
        reader.readAsDataURL(e.target.files[0])
        reader.onloadend = () => {
        setFieldValue('image',reader.result)
        }
        setImageName(e.target.files[0].name)
      }
  }

  // Change the format of the date
  const handleDate = (date) => {
    let new_date = date.split('/')
    const tmp = new_date[0]
    new_date[0] = new_date[1]
    new_date[1] = tmp
    new_date = new_date.join('/')
    return new_date
  }

  // Get the chosen vacation and set the initial values
  const getVacation = async () => {
    const res = await fetch(`https://vacationweb.herokuapp.com/vacation/${vacationToEdit}`)
    const { vacation } = await res.json()
    setSelectedStartDate(handleDate(vacation.start_date))
    setSelectedEndDate(handleDate(vacation.end_date))
    setInitialValues(vacation)
    setImageName(vacation.imageName)
  }

    // Update vacation settings
    const editVacation = async (values) => {
      setButtonDisabled(true)
      if(values.image === initialValues.image) delete values.image
      let end_date =  handleDate(moment(selectedEndDate).format('L'))
      let start_date =  handleDate(moment(selectedStartDate).format('L'))
      const res = await fetch('https://vacationweb.herokuapp.com/vacation',{
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({...values, start_date, end_date, imageName})
        })
        const { vacation, error } = await res.json()
        if(vacation) {
          let newVacationArray = vacations
          const findIndex = vacations.findIndex(item => item.id === vacation.id)
          newVacationArray[findIndex] = vacation
          console.log('after ', newVacationArray)
          dispatch(updateVacations(newVacationArray))
          handleClose()
          successToast('Vacation Updated! 😀')
          setButtonDisabled(false)
        } else {
          setMessage(error)
          setOpenAlert(true)
          setButtonDisabled(false)
        }
    }

    useEffect(() => {
      if(editModalOpen) getVacation() 
    }, [editModalOpen])
   
    return (
      <>
      { initialValues &&
        <Modal size="lg"  centered show={editModalOpen} onHide={handleClose}>
        <Modal.Header className=""> <Modal.Title style={{fontWeight:'700',margin:'auto'}}> Edit vacation </Modal.Title> </Modal.Header>
      <Modal.Body>
      <Formik
              initialValues={initialValues}
              onSubmit={(values,{resetForm}) => editVacation(values, resetForm)}
              validationSchema={validationSchema}
              enableReinitialize={true}>
              {(props) => (
                <form style={{textAlign:'center'}} onSubmit={props.handleSubmit} autoComplete="off">
                  <TextField className="MuiInputBases" margin="normal" name="destination" label="Destination" variant="outlined" fullWidth 
                  {...props.getFieldProps('destination')} {...errorHelper(props,'destination')}/> 
                  
                  <TextField className="MuiInputBases" margin="normal" name="description" label="Description" variant="outlined" fullWidth 
                  {...props.getFieldProps('description')} {...errorHelper(props,'description')}/>     
              
                  <TextField className="MuiInputBases" margin="normal" name="price" label="Price" variant="outlined" fullWidth 
                  {...props.getFieldProps('price')} {...errorHelper(props,'price')}/>  

                  <Grid item xs={6} md={3}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                        style={{margin:'3px 22px 12px 0px', border:'1px solid lightgrey', padding:'5px'}}
                        label="start date"
                        format="dd/MM/yyyy"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        />
                        <KeyboardDatePicker
                        label="end date"
                        style={{margin:'3px 22px 12px 0px', border:'1px solid lightgrey', padding:'5px'}}
                        format="dd/MM/yyyy"
                        value={selectedEndDate}
                        onChange={handleEndDateChange}
                        />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  
                  <Input id="file"  className="inputfile" type="file" name="photo" onChange={(e) => handleChangeImage(e,props.setFieldValue )} hidden/> 
                  <Button style={{display:'block', margin:'5px 0px'}} color='primary'  variant="outlined"><ImageIcon className=""/><label htmlFor="file">{imageName ? `${imageName} UPLOADED` : ' Vacation image'} </label></Button>
                  {props.errors.photo && props.touched.photo ?  <div className="error">{props.errors.photo}</div>  : null} 


                  {/* Alert error */}
                     <Collapse in={openAlert}>
                        <Alert
                        severity="error"
                        action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                        {message}
                        </Alert>
                        </Collapse>
                        <Button disabled={buttonDisabled} className="my-3" variant="contained" color="primary" type="submit" size="large"> Update vacation </Button>
                         </form> )}
                    </Formik>  
            </Modal.Body>
          </Modal>
      }
       {/* ToastContainer */}
       <ToastContainer  draggable={false} /> 
      </>
    )
  }
export default EditModal