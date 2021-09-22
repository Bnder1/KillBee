import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LoginComponent from '../Authentication/LoginComponent';


const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
        marginLeft: "6vh"
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
        paddingRight: '2vh',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
    },
}));

export function Header() {

    const classes = useStyles();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const login = () => {
        setOpenLogin(true);
    };

    const closeLogin = () => {
        setOpenLogin(false);
    }
    return (
        <React.Fragment>
            {
                openLogin && <LoginComponent closeForm={closeLogin}/>
            }
            <Toolbar className={classes.toolbar}>
                <Button size="small">Killbee Foundation</Button>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    noWrap
                    className={classes.toolbarTitle}
                >
                    An internal tool for the company
                </Typography>

                <Typography
                    component="h6"
                    variant="h6"
                    color="primary"
                    align="right"
                    noWrap
                    className={classes.toolbarSecondary}
                >
                    Project A5
                </Typography>

                <Button variant="outlined" size="small" onClick={login}>
                    Sign in
                </Button>

            </Toolbar>
        </React.Fragment>
    );
}

export default Header;