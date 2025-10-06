import logo from './logo.svg';
import './App.css';
import { useContext } from 'react';
import AppContext from './components/context/appContext';
import { Switch, Route, Link, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Admin from './components/admin';
import Dashboard from './components/dashboard';
import Pdf from './components/PDF';
import { useEffect } from 'react';
function App() {
  const context = useContext(AppContext)
  const { helloworld } = context
  console.log(helloworld);
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    
  //  if(location.pathname!=="/"){
  //   history.push("/")
  //  }
   
  }, [location.pathname])

  return (
    <>

      {/* <div className="d-flex py-3 justify-content-center">

        <Link to="/"> <div className="btn btn-outline-primary px-2 mx-2">Home</div></Link>
        <Link to="/about"> <div className="btn btn-outline-primary px-2 mx-2">About</div></Link>
        <Link to="/users"> <div className="btn btn-outline-primary px-2 mx-2">Users</div></Link>
      </div> */}
      <div>


        <Switch>


          <Route path="/" exact>
            {() => {
              history.push('/dashboard')
              return (
                null
              )
            }}
            {/* <div class="alert alert-danger" role="alert">
              Trial Period Expired!
            </div> */}
          </Route>

          <Route path="/dashboard"  >
            <Dashboard />
          </Route>

          <Route exact path="/pdf/:id">
            <Pdf />
          </Route>

          <Route path="/admin" exact>
            <Admin />
          </Route>

        </Switch>
      </div>

    </>

  );
}

export default App;
