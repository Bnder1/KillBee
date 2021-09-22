import React, {useState} from 'react';
import {
    Button,
    Grid,
    Input,
    TextField
} from "@material-ui/core";

import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import ManagementList from '../Components/ManagementContainer/ManagementList';
import {Autocomplete} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        paddingBottom: "vh",
        minHeight: "80vh",
        backgroundColor: "#deefff",
    },
    displayContainer: {
        padding: "2vh",
        minHeight: "80vh",
    },
    toolBar: {
        padding: "2vh"
    },


}));


function WelcomeView() {
    const classes = useStyles();

    return (
        <Grid container xs={12} className={classes.mainContainer}>
            <Grid item xs={12}>
                <Grid container direction={"row"} className={classes.toolBar}>
                    <Grid xs={4}>
                        <Button variant="outlined">New product</Button>
                    </Grid>
                    <Grid xs={5}>
                        <TextField
                            fullWidth
                            name="search"
                            margin="dense"
                            variant="outlined"
                            label="Search"
                            placeholder="Search a product"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.displayContainer}>
                <ManagementList/>
            </Grid>
        </Grid>
    );
}

export default WelcomeView;