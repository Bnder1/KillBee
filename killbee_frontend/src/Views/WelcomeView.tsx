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
import {useSelector} from 'react-redux';
import {authSelector} from '../State/slices/profile';
import ProductsForm from '../Components/Forms/ProductsForm';
import { Switch } from 'antd';

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
        padding: "2vh",
    },
    switch: {
        textAlign: "end",
        paddingTop: "1vh",
        paddingRight: "2vh"
    }


}));


function WelcomeView() {
    const classes = useStyles();
    const [newProductForm, setNewProductForm] = useState<boolean>(false);
    const handleClose = () => setNewProductForm(false);
    const {isAuth, currentUser} = useSelector(authSelector);
    return (
        <Grid container xs={12} className={classes.mainContainer}>
            <React.Fragment>
                <Grid item xs={12}>
                    <Grid container xs={12} direction={"row"} className={classes.toolBar}>
                        <Grid xs={4}>
                            {newProductForm && <ProductsForm onclose={() => handleClose}/>}
                            <Button variant="outlined" onClick={() => setNewProductForm(true)}>New
                                product</Button>
                        </Grid>
                        <Grid xs={5}>
                            <TextField
                                fullWidth
                                name="search"
                                margin="dense"
                                variant="outlined"
                                label="Search"
                                placeholder="Search a product"/>
                        </Grid>
                        <Grid xs={3} className={classes.switch} >
                            <Switch
                                checkedChildren={"Products"}
                                unCheckedChildren={"Ingredients"}
                            />
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.displayContainer}>
                    <ManagementList/>
                </Grid>
            </React.Fragment>
        </Grid>

    )

}

export default WelcomeView;