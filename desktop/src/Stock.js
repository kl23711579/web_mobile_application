import React, { useState } from 'react';
import StockTable from './StockTable';
import { useStockPrice } from './api'
import IndustrySelection from './IndustrySelection';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function Stock() {

  const useStyles = makeStyles({
    root:{
      '& > *': {
        margin: '15px',
        marginLeft: '0px'
      }
    }
  });
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("default");
  const { allStockPriceData, filterStockPriceData, error } = useStockPrice({ "Stock": searchStock, "Industry": searchIndustry });

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <form autoComplete="off">
          <TextField
            aria-labelledby="search-button"
            id="search"
            name="search"
            type="search"
            label="Input Stock Code"
            variant="outlined"
            placeholder="-------"
            style={{
              margin: '15px',
              marginLeft: '0px'
            }}
            onChange={(e) =>{setSearch(e.target.value)}}
          />
          <Button
            variant="contained"
            id="search-button"
            color="primary"
            size="large"
            style={{
              margin: '15px',
              marginLeft: '0px'
            }}
            onClick={ () => {setSearchStock(search)} }
          >
            Search
          </Button>
          <IndustrySelection rowData={allStockPriceData} handleOnChange={value => { setSearchIndustry(value); }} />
        </form>
      </div>
      { error ? 
        <p> Something error when fetching data, please check network and refresh page.</p> :
        <StockTable tableData={filterStockPriceData} /> }
    </div>
  );
}

export default Stock;