import React from 'react';
import {
    Grid,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
   mainContainer : {
       minHeight: "80vh",
       backgroundColor: "#deefff",
   },
    displayContainer: {
        height: "80vh",
    }
}));

function WelcomeView() {
    const classes = useStyles();
    return (
        <Grid container xs={12} className={classes.mainContainer}>
            <Grid item xs={12}>
            </Grid>
        </Grid>
    );
}

export default WelcomeView;