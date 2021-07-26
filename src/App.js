
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './App.css';
import firebaseConfig from './firbase.config';
import logo from './images/logo.png';



firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser, setnewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  });


  var provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn=()=>{
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
  
  console.log(result);
  }).catch((error) => {

  });
  }




  const handleSingOut=()=>{
    firebase.auth().signOut().then(() => {
      const singedOutUser={
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
          }
          setUser(singedOutUser);
    }).catch((error) => {
      
    });
  }



  
  const handleBlur=(e)=>{
    let isFromValid=true;
    if(e.target.name==='email'){
     isFromValid= /\S+@\S+\.\S+/.test(e.target.value);
    
    }
    if(e.target.name ==='password'){
    const isPasswordValid= e.target.value.length>8;
    const passwordHash= /\d{1}/.test(e.target.value);
    isFromValid=isPasswordValid && passwordHash;
    }
    if(isFromValid){
      const newUserInfo={...user};
      newUserInfo[e.target.name]=e.target.value;
      setUser(newUserInfo);
    }
    }

 const handleSubmit=(e)=>{
  if(newUser&& user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((res) => {
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo);
      updateUserName(user.name);
    })
    .catch((error) => {
      const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
    });
  }


  if(!newUser &&user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((result) => {
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
  })
  .catch((error) => {
    const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
  });
  }
  e.preventDefault();
 }

const updateUserName=name=>{
  const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  
}).then(() => {
  console.log('User Name Name Update Successfullay')
}).catch((error) => {
 console.log(error)
});  
}
return (
<div className="App Box">
 <img className="logo" src={logo} alt="Logo" />
  <Form className="Form" onSubmit={handleSubmit}>

  <Form.Group className="mb-3" controlId="formBasicEmail">
  {newUser&&<Form.Control onBlur={handleBlur} type="text" placeholder="Enter Name"  required/>}
  </Form.Group>


  <Form.Group className="mb-3" controlId="formBasicEmail">
  <Form.Control onBlur={handleBlur} type="email" placeholder="Enter email" name ="email"  required/>
  <Form.Text className="text-muted">
  We'll never share your email with anyone else.
  </Form.Text>
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
  <Form.Control onBlur={handleBlur} type="password" placeholder="Enter Password" name ="password" required />
  </Form.Group>
  
  <label className="Label" onClick={()=>setnewUser(!newUser)} type="submit" name ="newUser" value="">Create your New Account ?</label><br/><br/>
  <Button variant="primary" type="submit">{newUser?'Sing UP':'Sing In'}</Button> 
<br/>
</Form>
<p style={{color:'red'}}>{user.error}</p>
{user.success && <p style={{color:'green'}}> User{newUser?'Created' :'Logged In'} success</p>}

{
user.isSignedIn ?<button  onClick={handleSingOut}  type="submit"> Sign out</button> :  <button onClick={handleSingIn} variant type="submit">Google Sign in</button>
}
    </div>
  );
}


export default App;
