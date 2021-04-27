import React,{ useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authUser } from '../../store/actions'
import SignInPhoto from '../../images/signPhoto.png'
// material ui
import { Hidden, Grid, TextField, Button, Link, Paper, Collapse, IconButton, InputAdornment  } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
// formik
import { useFormik } from 'formik'
import * as Yup from 'yup'
// bootstrap
import Carousel from 'react-bootstrap/Carousel'
// css
import './style.css'
// cloudinary
import { Image } from 'cloudinary-react'
  
const useStyles = makeStyles((theme) => ({
    root: {
      marginTop:'20px',
      
    },
    image: {
      position:'relative',
      backgroundImage: `url(${SignInPhoto})`,
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
      margin:'70px 15px '
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}))

const SignIn = ({ setIsAuth }) => {
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const classes = useStyles()

    // Formik
    const formik = useFormik({
      initialValues:{email:'',password:''},
      validationSchema:Yup.object({
          username:Yup.string()
          .required('sorry username is required'),
          password:Yup.string()
          .required('password is required')
          .min(6, 'password have to be at least 6 characters long')
      }),
      onSubmit:(values,{resetForm}) => {                               
        loginUser(values)
      }
    })

    const errorHelper = (formik,values) => ({
        error: formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
    })
  
    // Handle password visibility
    const  handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }
   
    // Log in user
    const loginUser = async (values) =>{
      try {
        setButtonDisabled(true)
        const response = await fetch('https://vacationweb.herokuapp.com/auth/login', { method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(values)
        })
        const data = await response.json()
       if(data.success){
          localStorage.setItem('user',JSON.stringify(data.user))
          dispatch(authUser(data.user))
          setIsAuth(true)
          setButtonDisabled(false)
          history.push('/')
       } else {
          setMessage(data.error)
          setOpenAlert(true)
          setButtonDisabled(false)
       }  
    } catch(error) {
       console.log(error)
    }
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={2}></Grid>
      <Hidden mdDown>
        <Grid item md={4} className={classes.image}>
          <Carousel fade className={classes.slider} interval={2000}>
            <Carousel.Item>
              <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618328411/Vacation_gn31mm.jpg" height="435" width="245" crop="scale" />
            </Carousel.Item>
            <Carousel.Item>
              <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618586733/abqc5fwzhygawexvo25p.jpg" height="435" width="245" crop="scale" />
            </Carousel.Item>
            <Carousel.Item>
              <Image src="https://res.cloudinary.com/malachcloud/image/upload/v1618329761/398bc8f537681ee210a06f06ecc199ec_easo8x.jpg" height="435" width="245" crop="scale" />
            </Carousel.Item>
          </Carousel>
        </Grid>
      </Hidden>

      {/* Sign in form */}
      <Grid item xs={12} sm={12} lg={4}  component={Paper}  square className={classes.formGrid}>
        <div className={classes.paper}>
          <Image cloudName="malachcloud" src="https://res.cloudinary.com/malachcloud/image/upload/v1618384622/summer-hot-vacation-logo-illustration-art-isolated-background-91286774_syvpkz.jpg" width="100" height="100" crop="scale" />
          <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
            <TextField  variant="outlined" margin="normal" fullWidth label="user name" name="email" autoFocus {...formik.getFieldProps('username')} {...errorHelper(formik,'username')}/>
            
            <TextField 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                </InputAdornment>
                )}}  
                variant="outlined" margin="normal" fullWidth name="password" label="Password" type={showPassword ? "text": "password"} {...formik.getFieldProps('password')} {...errorHelper(formik,'password')}/>
                {/* Error Alert */}
                <Collapse in={openAlert}>
                  <Alert
                    severity="error"
                    action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                    {message}
                  </Alert>
                </Collapse>

                <Button disabled={buttonDisabled} className="my-3" variant="contained" color="primary"type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Sign In </Button>
                
                <Grid container>
                  <Grid item>
                    <Link href="/signup" variant="body2"> Don't have an account? Sign Up </Link>
                  </Grid>
                </Grid>
            </form>
          </div>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    )
}
export default SignIn
