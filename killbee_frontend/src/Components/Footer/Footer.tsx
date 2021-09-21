import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {Grid} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: "#deefff",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        borderColor:"black"
    },
}));

export default function Footer() {

    const classes = useStyles();

    return (
        <Grid item alignItems={"flex-end"}>
            <footer className={classes.footer}>
                <Container maxWidth="lg">
                    <Typography variant="h6" align="center" gutterBottom>
                      KillerBee Foundation
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Made for the A5 cybersecurity project.
                    </Typography>
                </Container>
            </footer>
        </Grid>
    );
}
