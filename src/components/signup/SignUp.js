import React,{ useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
// import images
import SignUpPhoto from '../../images/signPhoto.png'
// material ui
import { makeStyles } from '@material-ui/core/styles'
import { Grid, TextField, Button, Link, Paper, Collapse, InputAdornment, Hidden } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
// bootstrap
import Carousel from 'react-bootstrap/Carousel'
// formik
import { Formik } from 'formik'
import * as Yup from 'yup'
// cloudinary
import { Image } from 'cloudinary-react'
// recaptcha
import ReCaptcha from 'react-google-recaptcha'
// css
import './style.css'

const useStyles = makeStyles((theme) => ({
    root: {
      marginTop:'20px'
    },
    image: {
      position:'relative',
      backgroundImage: `url(${SignUpPhoto})`,
      backgroundRepeat: 'no-repeat',
      alignSelf: 'center',
      backgroundPosition: '0 0',
      backgroundSize: '454px 618px',
      flexBasis: '454px',
      height: '618px',
    },
    slider: {
      width:'54%',
      margin: '99px 0 0 151px',
      position: 'relative',
      left:'-3px',
      bottom: '3px'
    },
    formGrid: {
      margin:'70px 15px'
    },
    paper: {
      margin: theme.spacing(3, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    profileBtn: {
      paddingTop:'10px',
      marginTop:'10px',
      marginBottom:'10px'
    },
    imageIcon: {
      marginBottom:'8px',
      marginRight:'5px'
    },
    nameTextField: {
      marginRight:'4px'
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}))


const SignUp = ({ setIsAuth }) => {
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const classes = useStyles()
  const reRef = useRef()
  const history = useHistory()
  
  // Form validation
  const validationSchema = Yup.object().shape({
    firstname:Yup.string()
    .required('first name is required!'),
    lastname:Yup.string()
    .required('last name is required!'),
    username:Yup.string()
    .required('user name is required!'),
    password:Yup.string()
    .required('password is required!')
    .min(6, 'password have to be at least 6 characters long'),
    confirmPassword:Yup.string()
    .required('confirm your password!')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    })

  const errorHelper = (formik,values) => ({
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })

  // Handle password visiblity 
  const  handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Handle confirm password visiblity 
  const handleClickConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Add new user
  const signUpUser = async (values) => {
    try {
      setButtonDisabled(true)
        //  const token = await reRef.current.getValue()
         const response = await fetch('https://vacationweb.herokuapp.com/auth/signup', { 
         method: 'POST',
         headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({...values })
        })
        const data = await response.json()
        // reRef.current.reset()
        if(data.user){
          localStorage.setItem('user', JSON.stringify({...data.user, newUser:true }))
          setIsAuth(true)
          setButtonDisabled(false)
          history.push('/')
        } else {
          setMessage(data.error)
          setOpenAlert(true)
          setButtonDisabled(false)
        }
        } catch (error) {
            console.error(error)
          }
  }
  
    return (
      <Grid container className={classes.root}>
        <Hidden mdDown>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={2} lg={4} className={classes.image} >
              <Carousel fade className={classes.slider} interval={2000}>
                <Carousel.Item>
                  <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618328411/Vacation_gn31mm.jpg" height="435" width="250" crop="scale" />
                </Carousel.Item>
                <Carousel.Item>
                <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618586733/abqc5fwzhygawexvo25p.jpg" height="435" width="250" crop="scale" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618329761/398bc8f537681ee210a06f06ecc199ec_easo8x.jpg" height="435" width="250" crop="scale" />
                </Carousel.Item>
              </Carousel>
            </Grid>
      </Hidden>
      
      {/* Sign up form */}
      <Grid item xs={12} lg={4}  component={Paper} elevation={6} square className={classes.formGrid}>
          <div className={classes.paper}>
          <Image cloudName="malachcloud" src="https://res.cloudinary.com/malachcloud/image/upload/v1618384622/summer-hot-vacation-logo-illustration-art-isolated-background-91286774_syvpkz.jpg" width="100" height="100" crop="scale" />
            <Formik
              initialValues={{username:'',password:'', firstname:'', lastname:''}}
              onSubmit={(values,{resetForm}) => signUpUser(values, resetForm)}
              validationSchema={validationSchema}
              enableReinitialize={true}>
              {(props) => (
                <form style={{textAlign:'center'}} onSubmit={props.handleSubmit} autoComplete="off">
                  <div style={{display:'flex'}}>
                    <TextField className={classes.nameTextField} name="firstname" margin="normal" label="First name" variant="outlined" fullWidth {...props.getFieldProps('firstname')} {...errorHelper(props,'firstname')}/>
                    <TextField name="lastname" margin="normal" label="Last name" variant="outlined" fullWidth {...props.getFieldProps('lastname')} {...errorHelper(props,'lastname')}/>     
                  </div>
              
                  <TextField name="username" margin="normal" label="User name" variant="outlined" fullWidth {...props.getFieldProps('username')} {...errorHelper(props,'username')}/>   
                          
                  <TextField  type={showPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="password" label="Password" {...props.getFieldProps('password')} {...errorHelper(props,'password')} 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                        </InputAdornment>
                        )}} />
                                
                  <TextField type={showConfirmPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirm Password" {...props.getFieldProps('confirmPassword')} {...errorHelper(props,'confirmPassword')} 
                    InputProps={{
                      endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickConfirmPassword}> {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                          </InputAdornment>
                      )}} />
                                      
                  {/* <ReCaptcha style={{margin:'10px 0px'}} sitekey="6LfruZ4aAAAAAAFNEQG6lPJLbJVjEThKg2DJdjEi" ref={reRef}/>  */}

                  {/* Alert error */}
                  <Collapse in={openAlert}>
                    <Alert
                      severity="error"
                      action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                      {message}
                    </Alert>
                  </Collapse>

                  <Button disabled={buttonDisabled} className="my-3" variant="contained" color="primary" type="submit" size="large" fullWidth> Sign up </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/signin" variant="body2"> Already have an account? Sign In </Link>
                    </Grid>
                  </Grid>    
                </form> )}
            </Formik>  
          </div>
        </Grid> 
        <Grid item xs={2}></Grid>
      </Grid>   
    )
}
export default SignUp














// const handleChangeImage = (e, setFieldValue) => {
//   setFieldValue("photo", e.target.files[0])
//   if(e.target.files.length === 0) {
//     setIsProfile(false)
//     setFileName('')
//   } 
//   else {
//     setIsProfile(true)
//     setFileName(e.target.files[0].name)
//   }
// }


// // Edit the profile image
// const editProfile =  (values) => {
//  values.fileName = fileName
//  if(typeof values.photo === 'object' ) {
//   const reader = new FileReader()
//   reader.readAsDataURL(values.photo)
//   reader.onloadend = () => {
//     values.photo = reader.result
//     signUpUser(values)
//   }
//  } else {
//   signUpUser(values)
//  }
// }

{/* <Input id="file"  className="inputfile" type="file" name="photo" onChange={(e) => handleChangeImage(e,props.setFieldValue )} hidden/> 
<Button style={{display:'flex', alignItems:'center', margin:'5px 0px'}} color='primary'  variant="outlined">
<div style={{marginRight:'7px'}}><ImageIcon/></div>
<label htmlFor="file">{fileName ? `${fileName} UPLOADED` : 'PROFILE IMAGE'} </label></Button>
{props.errors.photo && props.touched.photo ?  <div className="error">{props.errors.photo}</div>  : null} */}