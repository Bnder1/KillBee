import {Button, Dialog, DialogContent, Grid, IconButton, TextField, Typography, withStyles} from "@material-ui/core";
import {green, grey, teal} from "@material-ui/core/colors";
import React, {Component, useState} from "react";
import CloseIcon from '@material-ui/icons/Close';


const styles = () => ({
    root: {
        flexGrow: 1,
    },
    primaryColor: {
        color: teal[500]
    },
    secondaryColor: {
        color: grey[700]
    },
    padding: {
        padding: 4
    },
    mainHeader: {
        backgroundColor: grey[100],
        padding: 20,
        alignItems: "center",
        borderColor: green[200],
        borderBottomWidth: 3
    },
    mainContent: {
        padding: 40,

    },
    secondaryContainer: {
        backgroundColor: grey[200],
    },
    inputContainer: {
        paddingTop: "3vh",
    },
    inputFields: {
        paddingBottom: "4vh",
        minWidth: "97vh"
    },
    loginButton: {
        paddingBottom: "4vh"
    }
});

function LoginComponent(props: any) {

    const {classes, closeForm} = props;
    const initForm = {
        email: "",
        password: ""
    };
    const [form, setForm] = useState(initForm);

    function handleChange(e: any) {
        const target = e.target;
        const setName = target.name;
        const value = target.value;
        setForm({
            ...form,
            [setName]: value
        })
        console.log(form);
    }

    const submitForm = () => {
        // Mettre le state action ici.
    }

    const [open, setOpen] = useState<boolean>(true);
    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
            >
                <DialogContent className={classes.padding}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Grid container direction="row" xs={12} className={classes.mainHeader}>
                                <Grid item xs={11}>
                                    <Typography className={classes.primaryColor} variant="h5">
                                        Login to Killerbee </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton style={{backgroundColor:"red"}} onClick={closeForm}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} className={classes.inputContainer}>
                            <form onSubmit={submitForm}>
                                <Grid item xs={12} className={classes.inputFields}>
                                    <TextField
                                        style={{marginBottom: 20}}
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        label="Username"
                                        defaultValue=""
                                        placeholder="Username"
                                    />
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="password"
                                        type={"password"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container xs={12} direction={"row"} justifyContent={"center"}
                                          className={classes.loginButton}>
                                        <Grid item >
                                            <Button type="button" variant="outlined" color="primary"
                                                    className="form__custom-button">
                                                Log in
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    );
}

export default withStyles(styles)(LoginComponent);