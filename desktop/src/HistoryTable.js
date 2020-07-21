import React, { useState, useEffect ,forwardRef} from 'react';
import { useParams } from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";
import DatePicker from "react-datepicker";
import StockChart from "./StockChart";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TodayIcon from '@material-ui/icons/Today';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "react-datepicker/dist/react-datepicker.css";

import { useHistoryStockPrice } from './api';

function HistoryTable() {
  const { code } = useParams();
  const datePickerRef = React.createRef();

  const useStyles = makeStyles({
    root: {
        "& > *": {
            margin: '15px',
            marginLeft: '0px'
        },
    },
    dateSearch: {
      display: 'flex'
    }
  }); 

  const classes = useStyles();

  // source: https://github.com/Hacker0x01/react-datepicker/issues/862
  const CustomInput = forwardRef( ({value, onClick}, _ref) => (
    <Button variant="outlined" ref={_ref} onClick={onClick} style={{width: '250px'}} endIcon={<TodayIcon />}>
        {value}
    </Button>
  ));

  const divRef = React.createRef();
  const [gridApi, setGridApi] = useState();
  const [rowData, setRowData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [nowDate, setNowDate] = useState(new Date());
  const [chartLabels, setChartLabels] = useState([]);
  const [chartClosingValue, setChartClosingValue] = useState([]);
  const { filterData, companyName, error } = useHistoryStockPrice({ code, searchDate });
  const rowsPerPage = 10;

  const columns = [
    { headerName: "Date", field: "Date", width: 120, flex: 2 },
    { headerName: "Open", field: "open", width: 105, flex: 1 },
    { headerName: "High", field: "high", width: 105, flex: 1 },
    { headerName: "Low", field: "low", width: 105, flex: 1 },
    { headerName: "Close", field: "close", width: 105, flex: 1 },
    { headerName: "Volumes", field: "volumes", width: 110, flex: 2 }
  ];

  const handleOnGridReady = (params) => {
    setGridApi(params.api);
  }

  useEffect(() => {
    setRowData(filterData);
    const dates = filterData.map( ele => ele.Date ).reverse();
    const closingvalue = filterData.map( ele => ele.close ).reverse();
    setChartLabels(dates);
    setChartClosingValue(closingvalue);
    if(gridApi && divRef.current){
      gridApi.setDomLayout("autoHeight");
      gridApi.sizeColumnsToFit();
      divRef.current.style.height=""
    }
  }, [filterData]);

  return (
    <div className={classes.root}>
      <p>Search date from: </p>
      <div className={classes.dateSearch}>
        <div>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={nowDate}
            onChange={date => setNowDate(date)}
            customInput={<CustomInput  ref={datePickerRef}/>}
          />
        </div>
        <div>
          <Button
            variant="contained"
            id="search-button"
            type="button"
            style={{marginLeft: '15px'}}
            onClick={() => setSearchDate(nowDate)}
          >
            Search
          </Button>
        </div>
      </div>
      { error ?
        <p> Something error when fetching data. Please check network and code. </p> :
        <div>
        <div> Showing stocks for the {companyName} </div>
          <div className="ag-theme-alpine" style={{ height: "350px", width: '100%' }} ref={divRef}>
            <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              pagination={true}
              paginationPageSize={rowsPerPage}
              onGridReady={handleOnGridReady}
            />
            <StockChart labels={chartLabels} stockdata={chartClosingValue} />
          </div>
        </div>}
    </div>
  );
}

export default HistoryTable;