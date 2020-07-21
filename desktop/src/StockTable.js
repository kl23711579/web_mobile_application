import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

function StockTable(props) {

  const { tableData } = props;
  const divRef = React.createRef();
  const [gridApi, setGridApi] = useState();
  const [rowData, setRowData] = useState([])
  const rowsPerPage = 10;

  const symbolCellRender = (params) => {
    return <Link to={`/history/${params.value}`}> {params.value} </Link>
  }

  const nameCellRender = (params) => {
    return <Link to={`/history/${params.data.symbol}`}> {params.value} </Link>;
  }

  const handleOnGridReady = (params) => {
    setGridApi(params.api);
  }

  const columns = [
      { headerName: "Symbol", field: "symbol", sortable: true, cellRendererFramework: symbolCellRender, flex: 1 },
      { headerName: "Name", field: "name", sortable: true, cellRendererFramework: nameCellRender, flex:2 },
      { headerName: "Industry", field: "industry", sortable: true, flex:2 }
  ];

  useEffect( () => {
    setRowData( (prev) => { 
      prev = tableData;
      return prev;
    })
    if(gridApi && divRef.current){
      gridApi.setDomLayout("autoHeight");
      gridApi.sizeColumnsToFit();
      divRef.current.style.height=""
    }
  }, [tableData]);

  return (
    <div className="ag-theme-alpine" style={{height: "350px", width: "100%"}} ref={divRef}>
      <AgGridReact
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={rowsPerPage}
        onGridReady={handleOnGridReady}
      />
    </div>
  );
}

export default StockTable;