import React, {useState} from "react";
import {withStyles, MenuItem} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import {teal, grey, green} from "@material-ui/core/colors";
import {Modal} from "antd";

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
        padding: 40
    },
    secondaryContainer: {

        backgroundColor: grey[200],

    }
});


function NewVoteDialog(props: any) {

    const {classes, open, onclose} = props;
    const initialForm = {
        _name: "",
        _description: "",
        _endTime: 0,
    };
    const [voteForm, setVoteForm] = useState(initialForm);
    const [openModal, setOpenModal] = useState<boolean>(true);

    function handleInputChange(e: any) {
        const target = e.target;
        const setName = target.name;
        const value = target.value;
        setVoteForm({
            ...voteForm,
            [setName]: value
        })
        console.log(voteForm);
    }

    async function submitVote() {
    }

    return (
        <form onSubmit={submitVote}>
            <Dialog
                className={classes.root}
                fullWidth
                maxWidth="md"
                open={openModal}
                onClose={() => props.onclose}
            >
                <DialogContent className={classes.padding}>
                    <Grid container xs={12}>
                        <Grid item xs={12}>
                            <Grid container direction="row" xs={12} className={classes.mainHeader}>
                                <Grid item xs={8}>
                                    <Typography className={classes.primaryColor} variant="h5">
                                        New Frisbee
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                className={classes.mainContent}
                                spacing={1}
                            >
                                <Grid item xs={10}>
                                    <TextField
                                        style={{marginBottom: 20}}
                                        fullWidth
                                        disabled={true}
                                        margin="dense"
                                        variant="outlined"
                                        label="Creator (you)"
                                    >
                                        <MenuItem>None Present</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={12}  style={{marginTop: 20}}>
                                    <TextField
                                        margin="dense"
                                        label="Frisbee name"
                                        fullWidth
                                        variant="outlined"
                                        id="name"
                                        name="name"
                                        placeholder={"Frisbee name"}
                                        onChange={handleInputChange}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        rows="5"
                                        variant="outlined"
                                        label="Frisbee description"
                                        name="description"
                                        id="description"
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        rows="1"
                                        variant="outlined"
                                        label="Frisbee pUHT "
                                        name="pUHT"
                                        id="pUHT"
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        rows="1"
                                        variant="outlined"
                                        label="Gamme "
                                        name="gamme"
                                        id="gamme"
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        rows="1"
                                        variant="outlined"
                                        label="Ingredients"
                                        name="ingredients"
                                        id="ingredients"
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        multiline
                                        rows="1"
                                        variant="outlined"
                                        label="Weight "
                                        name="weight"
                                        id="weight"
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container direction="row" justify={"center"} spacing={2}
                                          style={{marginTop: 9}}>
                                        <Grid item>
                                            <IconButton
                                                onClick={onclose()}
                                                edge="start"
                                                aria-label="Close"
                                                style={{padding: 8, color: "red"}}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <Button onClick={submitVote} variant={"outlined"}
                                                    style={{borderColor: "green"}}>Create frisbee
                                                !</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </form>
    );
}

export default withStyles(styles)(NewVoteDialog);