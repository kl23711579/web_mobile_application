import { useEffect, useState } from 'react';

function getStockPrice(search) {
  const url = " http://131.181.190.87:3001" + (search ? `/all?symbol=${search}` : "/all");

  return fetch(url)
    .then(res => res.json());
}

export function useStockPrice(search){

  const { Stock, Industry } = search;

  const [allStockPriceData, setAllStockPriceData] = useState([]);
  const [stockPriceData, setStockPriceData] = useState([]);
  const [filterStockPriceData, setFilterStockPriceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect( () => {
    getStockPrice().then(res => {
      setAllStockPriceData(res);
      setStockPriceData(res);
    })
    .catch((error) => {
      setError(error);
    });
  },[])

  // First useEffect
  useEffect( () => {

    let result;
    const keyword = Stock.trim();
    if(!keyword) {
      result = allStockPriceData;
    } else {
      result = allStockPriceData.filter(ele => {
        return ele.symbol.includes(keyword);
      });
    }

    setStockPriceData(result);
  }, [Stock, allStockPriceData]);

  //Second useEffect
  useEffect( () => {
    if(Industry === "default"){
      setFilterStockPriceData(stockPriceData);
    } else {
      const result = stockPriceData.filter(ele => {
        return ele.industry.includes(Industry);
      });
      setFilterStockPriceData(result);
    }
  }, [Industry, stockPriceData]);

  return { allStockPriceData, filterStockPriceData, error };
}

function getHistoryStockPrice(code){
  const url = " http://131.181.190.87:3001" + (code ? `/history?symbol=${code}` : "/history");

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(res => {
      return res.map( ele => {
        const date = new Date(ele["timestamp"]);
        const dateStr = date.getDate() + "/" + (date.getMonth()+1 ) + "/" + date.getFullYear();
        ele["Date"] = dateStr;
        return ele;
      });
    })
}

export function useHistoryStockPrice( { code, searchDate } ){

  const [historyStockPriceData, setHistoryStockPriceData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState(null);

  useEffect( () => {
    getHistoryStockPrice(code).then( res => {
      setHistoryStockPriceData(res);
      setFilterData(res);
      if(res.length > 0) {
        setCompanyName(res[0]["name"]);
      }
    }).catch(error => {
      setHistoryStockPriceData([]);
      setFilterData([]);
      setCompanyName("");
      setError(error);
    });
  }, [code]);

  useEffect( () => {
    if(searchDate){
      const result = historyStockPriceData.filter( ele => {
        const d = ele["Date"].split("/");
        const originalDate = new Date(parseInt(d[2]), (parseInt(d[1])-1), parseInt(d[0]));
        const date = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
        return date.valueOf() <= originalDate.valueOf();
      });
      setFilterData(result);
    }
  },[searchDate, historyStockPriceData] );

  return { filterData, companyName, error }
}