import React, { useState } from 'react'
import './signUp.css'
import { Alert, Box, Button, TextField } from '@mui/material'
import Password from '../../lib/Password/Password'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'



const Signup = () => {
  const initForm={
    name:"",
    email:"",
    userId:"",
    password:"",
    confirmPassword:""

  }
 const [signUpForm,setSignUpForm]=useState(initForm)
 const [errorMessage,setErrorMessage]=useState({...initForm,serverError:''})
 const [showMessage,setShowMessage]=useState('')
  const navigate=useNavigate()
  const onSignUpFocuusUpdate = (e,type) => {
    setErrorMessage((p) => {
      return {...p,[type]:''}
    })
  }
 const onSignUpFormUpdate=(e,type)=>{
  setErrorMessage({...initForm,serverError:''})
  setSignUpForm((p)=>{
    return {...p,[type]:e.target.value}
  })
 }
 const validator=(formdata)=>{
 let error={}
 let regex = /^[a-zA-Z]+$/;
 let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 let userIdRegex = /^[a-zA-Z0-9_]{3,15}$/;
 let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 if(!regex.test(formdata?.name)){
  error.name='name is not valid'
 }
 if(!emailRegex.test(formdata?.email)){
   error.email='email is not valid'
 }
 if(!userIdRegex.test(formdata?.userId)){
error.userId="User ID must be 3-15 characters and can only contain letters, numbers, or underscores'"
 }
if(!passwordRegex.test(formdata?.password)){
  error.password='Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, a number, and a special character';
}
if(formdata?.confirmPassword===''){
  error.confirmPassword='conirmPassword  and password should be same'
}
 return error
 }
 
const onSignUpformSubmit=async(e)=>{
 e.preventDefault()
 try{
let error=validator(signUpForm)
if(Object.keys(error).length>0){
  setErrorMessage(error)
}
else{
const signUpUser=await axios.post('http://localhost:8888/thirdProject/api/v1/user/signUp',{
  name:signUpForm.name,
  email:signUpForm.email,
  userId:signUpForm.userId,
  password:signUpForm.password,
  confirmPassword:signUpForm.confirmPassword
})
const response=signUpUser.data
console.log(response)
if(response && response?.message==='register successfully'){
 setShowMessage('register successfully')
setTimeout(()=>{
  navigate('/home')
},1500)

}

}
 }
 catch(e){
  console.log(e)
  setErrorMessage((p)=>{
 return {...p,serverError:e.response.data.message??e.message}
  })
 }
}
 
 console.log(errorMessage)
 console.log(signUpForm)
  return (
    <div className='signUp-container'>
      <div className='signUp-modal'>
        <div className='signUp-header'>
          <h2>SignUp Form</h2>
          <h5>Please fill the form to create an account</h5>
        </div>
       {
        showMessage &&  <Alert variant="filled"  sx={{paddingLeft:"15px",paddingRight:"15px"}} severity="success">{showMessage}</Alert>
       }
        <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{width:360,minHeight:350}}
      onSubmit={onSignUpformSubmit}
    >
     <TextField id="Name" label="Name" variant="outlined" fullWidth sx={{marginTop:1.5}}  value={signUpForm.name} onChange={(e)=>onSignUpFormUpdate(e,'name')} onFocus={(e)=>onSignUpFocuusUpdate(e,'name')}/>
     {errorMessage?.name && <div style={{color:"red"}}>{errorMessage?.name}</div>}
     <TextField id="Email" label="Email" variant="outlined" fullWidth sx={{marginTop:1.5}} value={signUpForm.email} onChange={(e)=>onSignUpFormUpdate(e,'email')} onFocus={(e)=>onSignUpFocuusUpdate(e,'email')}/>
     {errorMessage?.email && <div style={{color:"red"}}>{errorMessage?.email}</div>}
     <TextField id="userId" label="UserId" variant="outlined" fullWidth sx={{marginTop:1.5}} value={signUpForm.userId} onChange={(e)=>onSignUpFormUpdate(e,'userId')} onFocus={(e)=>onSignUpFocuusUpdate(e,'userId')}/>
     {errorMessage?.userId && <div style={{color:"red"}}>{errorMessage?.userId}</div>}
     <Password label={"Password"} id={'Password'} value={signUpForm.password} onChange={(e)=>onSignUpFormUpdate(e,'password')} onFocus={(e)=>onSignUpFocuusUpdate(e,'password')}/>
     {errorMessage?.password && <div style={{color:"red"}}>{errorMessage?.password}</div>}
     <Password label={"Confirm Password"} id={"Confirm Password"} value={signUpForm.component} onChange={(e)=>onSignUpFormUpdate(e,'confirmPassword')} onFocus={(e)=>onSignUpFocuusUpdate(e,'confirmPassword')}/>
     {errorMessage?.confirmPassword && <div style={{color:"red"}}>{errorMessage?.confirmPassword}</div>}
     <Button type='submit' variant='contained' sx={{marginTop:2}}>SUBMIT</Button>
     {
      errorMessage?.serverError && <Alert variant="filled" severity="error">{errorMessage?.serverError}</Alert>
     }
     
     
     
    </Box>

      


       
      </div>
    </div>
  )
}

export default Signup