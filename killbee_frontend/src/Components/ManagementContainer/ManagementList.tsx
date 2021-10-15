import {Avatar, Button, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import  tableCellClass from '@material-ui/core/TableCell';
import React, { useEffect } from "react";
import {useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { productSelector } from "../../State/slices/products";

const useStyles = makeStyles((theme) => ({
  table: {
      backgroundColor:"red",
      minHeight:"80vh",
  }
}));

function createData(
    name: string,
    calories: number,
    fat: number,
) {
    return { name, calories, fat };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
];

export default function ManagementList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const {isLoading, error, allProducts, currentProduct} = useSelector(productSelector);
    const classes = useStyles();
    return (
      <Grid item xs={12}>
          {
              allProducts &&
              <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                      <TableHead>
                          <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell align="right">Description</TableCell>
                              <TableCell align="right">Ingredient&nbsp;(unique)</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {allProducts.map((row : any) => (
                              <TableRow
                                  key={row.name}
                              >
                                  <TableCell component="th" scope="row">
                                      {row.name}
                                  </TableCell>
                                  <TableCell align="right">{row.description}</TableCell>
                                  <TableCell align="right">{row.ingredient}</TableCell>
                                  <TableCell align="right"> <Button variant="outlined" onClick={() => {
                                  }}>Edit
                                  </Button></TableCell>
                                  <TableCell align="right"> <Button variant="outlined" onClick={() => {
                                  }}>Delete </Button></TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </TableContainer>
          }
      </Grid>
    );
}
