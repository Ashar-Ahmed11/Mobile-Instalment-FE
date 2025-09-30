import React from 'react'

import { useState, useEffect } from 'react'

import { useContext } from 'react'
import AppContext from "./context/appContext";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

// import Spinner from './spinner'
export default function Admin() {
const location = useLocation();
const history = useHistory()
     const notifyWrongCred = () => {
    toast.error("wrong credentials", {
      position: "top-right",
      autoClose: 3000, // time in ms
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

     useEffect(() => {
    if (location.state?.logout) {
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clear the state so it doesn’t re-trigger on refresh
      history.replace("/admin");
    }
  }, [location, history]);
  
 
    // const { cloudinary } = context

    // const [file, setFile] = useState()

    // const sendFile = (e) => {
    //     e.preventDefault()
    //     cloudinary(file)


    // }

    

    

    const [credentials, setCredentials] = useState({username:"",password:""})
     const [loading, setLoading] = useState(false);
   const { loggedIn } = useContext(AppContext);
 useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      history.push("/dashboard");
    }
  }, [history]);
    // setImgIsLoaded(true)
    // setMainLoader(false)
    // setcheckouter(true)
    // // setEditorLoader(true)
    // const [password, setPassword] = useState("")
    // const declareLogin=(e)=>{
    //     e.preventDefault()
    //     loginAdmin(password)
     
    // }
    const color = "#6699ff"
    return (
        // <div  style={{marginTop:"150px"}}>
        //     <h1 className="text-center">This is admin panel</h1>
        //     <div className="d-flex justify-content-center">
        //         <form onSubmit={(e)=>sendFile(e)}>
        //         <input type="file" onChange={(e)=>{setFile(e.target.files[0])}} />
        //         <button type="submit">Submit</button>
        //         </form>
        //     </div>
        // </div>
        <div className='my-5'>
            <div className="pt-5">
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-column pt-5">
                        <div className="card  shadow-sm" style={{ width: '400px', backgroundColor: "#fff", border: `1px solid ${color}` }}>
                            <h1 className="text-center my-3" style={{ fontFamily: 'Montserret', color: color }}>Admin Panel</h1>
                            <form 
  onSubmit={async (e) => {
    e.preventDefault();
    setLoading(true)
    const result = await loggedIn(credentials.username, credentials.password);
    setLoading(false)
    console.log(result)
   if (result.success) {
  localStorage.setItem("authToken", result.authToken);
  history.push("/dashboard", { justLoggedIn: true });
} else {
  notifyWrongCred(); // show toast
}
  }}
>
                                <div class="mb-3 mx-3">
                                    <input value={credentials.username} onChange={(e)=>{setCredentials({...credentials,username:e.target.value})}}   style={{ color: color, backgroundColor: '#fff', borderColor: color }} type="text" class="form-control my-2" id="exampleFormControlInput1" placeholder="Username" />
                                    <input value={credentials.password} onChange={(e)=>{setCredentials({...credentials,password:e.target.value})}}   style={{ color: color, backgroundColor: '#fff', borderColor: color }} type="password" class="form-control" id="exampleFormControlInput1" placeholder="Password" />
                                </div>
                                <div className="d-flex justify-content-center mt-2 mb-4">
                                    <button
                    type="submit"
                    className="btn d-flex align-items-center"
                    style={{ color: color, borderColor: color, backgroundColor: "#fff" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                                </div>
                            </form>
                        </div>
                        {/* {loginLoader && <div className='d-flex justify-content-center'>
                            <Spinner />
                        </div>} */}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}