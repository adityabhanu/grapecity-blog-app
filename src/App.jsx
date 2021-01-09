import Login from './MainComponents/Login/Login.jsx'
import Blogs from './MainComponents/Blogs/Blogs.jsx';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { Switch } from 'react-router'


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route path='/login' exact component={() =>
              <Login />
            }>
            </Route>
            <Route path='/blog' exact component={() =>
              <Blogs />
            }>
            </Route>


            <Route exact path='/'
              render={() => {
                return (
                  !localStorage.getItem("userName") ?
                    <Redirect to="/login" /> :
                    <Redirect to="/blog" />
                )
              }}

            />
          </Switch>



        </header>
      </div>
    </Router>

  );
}

export default App;
