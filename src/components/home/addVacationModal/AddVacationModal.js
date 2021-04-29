import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addVacationToRedux } from '../../../store/actions'
// Bootstrap
import Modal from 'react-bootstrap/Modal'
// Formik
import { Formik } from 'formik'
import * as Yup from 'yup'
// React toastify 
import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Material ui
import { Input, IconButton, Collapse, TextField, Button, Grid  } from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
// Css
import './style.css'
// momentjs 
const moment = require('moment')

const AddVacationModal = ({ addVacationModalOpen, setAddVacationModalOpen }) => {
    const [imageName, setImageName] = useState('')
    const [message, setMessage] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date())
    const dispatch = useDispatch()

    // Close the modal
    const handleClose = () => setAddVacationModalOpen(false)
   
    // Handle the dates state
    const handleStartDateChange = (date) => setSelectedStartDate(date)
    const handleEndDateChange = (date) => setSelectedEndDate(date)

    // Formik
    const validationSchema = Yup.object().shape({
        description:Yup.string()
        .required('description is required')
        .min(6, 'That it? write some more(min 6 characters)'),
        destination:Yup.string()
        .required('destination is required'),
        price:Yup.string()
        .required('price is required'),
        image:Yup.string()
        .required('image is required'),
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

    // Add vacation
    const addVacation = async (values) => {
        try {
            setButtonDisabled(true)
            let end_date =  moment(selectedEndDate).format('L').split('/')
            let start_date =  moment(selectedStartDate).format('L').split('/')
            const tmp = end_date[0]
            end_date[0] = end_date[1]
            end_date[1] = tmp
            end_date = end_date.join('/')
            const tmp1 = start_date[0]
            start_date[0] = start_date[1]
            start_date[1] = tmp1
            start_date = start_date.join('/')
            const res = await fetch('https://vacationweb.herokuapp.com/vacation',{
                 method: 'POST',
                 headers: {
                     'Content-Type':'application/json'
                 },
                 body: JSON.stringify({...values, end_date, start_date, imageName })
                 })
            const { vacation, error } = await res.json()
            if(vacation) {
                dispatch(addVacationToRedux(vacation))
                setButtonDisabled(false)
                handleClose()
                window.scrollTo(0,document.body.scrollHeight)
                successToast('Vacation Added! 😎')
            } else {
                setMessage(error)
                setOpenAlert(true)
                setButtonDisabled(false)
            }
        } catch (error) {
            console.log(error)
        }
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
    return (
        <>    
            <Modal show={addVacationModalOpen} onHide={handleClose} size="lg" centered>
                <Modal.Header> <Modal.Title style={{fontWeight:'700', margin:'auto'}}> Add new vacation </Modal.Title> </Modal.Header>
                <Modal.Body>
                  <Formik
                        initialValues={{ destination: '', description: '', start_date: '', end_date: '', price: '', image: ''}}
                        onSubmit={(values,{resetForm}) => addVacation(values, resetForm)}
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
                            <Button style={{display:'block', margin:'5px'}} color='primary'  variant="outlined"><ImageIcon className=""/><label htmlFor="file">{imageName ? `${imageName} UPLOADED` : 'VACATION IMAGE'} </label></Button>
                            {props.errors.image && props.touched.image ?  <div className="error">{props.errors.image}</div>  : null} 

                            {/* Alert error */}
                             <Collapse in={openAlert}>
                                <Alert
                                severity="error"
                                action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                                    {message}
                                </Alert>
                            </Collapse> 
                            
                            <Button disabled={buttonDisabled} className="my-3" variant="contained" color="primary" type="submit" size="large"> Add vacation </Button>
                            </form> )}
                        </Formik>  
                </Modal.Body>
            </Modal> 
            {/* ToastContainer */}
            <ToastContainer  draggable={false} />   
        </>
        
    )
}

export default AddVacationModal
