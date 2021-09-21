import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Grid} from "@material-ui/core";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import WelcomeView from "./Views/WelcomeView";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mainContainer : {
    minHeight: "100vh",
    backgroundColor: "#deefff",
  },

  displayContainer: {
    height: "80vh",
    backgroundColor: "#deefff",
  },
  routerContainer: {
    height: "70vh",
  },

}));
function App() {
  const classes = useStyles();
  return (
      <React.Fragment>
        <Router>
          <Grid container xs={12}
                className={classes.mainContainer}>
            <Grid item xs={12} className={classes.displayContainer}>
              <Header/>
            </Grid>
            <Grid item xs={12} className={classes.routerContainer}>
              <Switch>
                <Route exact path="/" component={WelcomeView}/>
              </Switch>
            </Grid>
            <Grid item xs={12} >
              <Footer />
            </Grid>
          </Grid>
        </Router>
      </React.Fragment>
  );
}
export default App;
