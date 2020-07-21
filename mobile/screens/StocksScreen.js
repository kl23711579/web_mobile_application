import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// fetch data from server
const fetchHistory = (symbol, url) => {    
  const historyUrl = url + "/history?symbol=" + symbol;
  return fetch(historyUrl)
    .then(res => res.json());
}

// sort function
function compare(a, b) {
  if(a > b){
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0
}

// row of stock list
const Item = ({ data, onChangeSymbol, selected }) => {
  const percent = (((data.close - data.open) * 100) / data.open).toFixed(2);
  return (
    <TouchableOpacity onPress={ () => onChangeSymbol(data.symbol) }>
      <View style={selected === data.symbol ? styles.rootitemgray : styles.rootitemblack}>
        <View style={styles.itemtext}>
          <Text style={[styles.textwhite, styles.itemtextsize]}>{data.symbol}</Text>
          <Text style={[styles.textwhite, styles.itemtextsize]}>{data.close}</Text>
        </View>
        <View style={styles.itemboard}>
          <View style={ percent > 0 ? styles.greenboard : styles.redboard}>
            <Text style={[styles.textwhite, styles.itemtextsize, styles.boardtext]}>{percent + "%"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// detail of stock
const ShowStockDetail = ({ stockData, selectedStock }) => {
  const stock = stockData.filter( ele => ele.symbol === selectedStock )

  return(
    <View style={styles.rootdetail}>
      <View style={styles.detailname}>
        <Text style={{fontSize: scaleSize(27), color: 'white'}}>{stock.length > 0 ? stock[0].name : ""}</Text>
      </View>
      <View style={styles.detailcontainer}>
        <View style={styles.detailtext}>
          <Text style={styles.textgray}>OPEN</Text>
          <Text style={styles.textwhite}> {stock.length > 0 ? stock[0].open : ""} </Text>
        </View>
        <View style={styles.detailtext}>
          <Text style={styles.textgray}>LOW</Text>
          <Text style={styles.textwhite}> {stock.length ? stock[0].low : ""} </Text>
        </View>
      </View>
      <View style={styles.detailcontainer}>
        <View style={styles.detailtext}>
          <Text style={styles.textgray}>CLOSE</Text>
          <Text style={styles.textwhite}> {stock.length ? stock[0].close : ""} </Text>
        </View>
        <View style={styles.detailtext}>
          <Text style={styles.textgray}>HIGH</Text>
          <Text style={[styles.textwhite, {textAlign: 'left'}]}> {stock.length ? stock[0].high : ""} </Text>
        </View>
      </View>
      <View style={styles.detailcontainer}>
        <View style={styles.detailtext}>
          <Text style={styles.textgray}>VOLUME</Text>
          <Text style={styles.textwhite}> {stock.length ? stock[0].volumes : ""} </Text>
        </View>
        <View style={styles.detailtext}>
        </View>
      </View>
    </View>
  );
}


export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [existSymbol, setExistSymbol] = useState([])
  const [selectedSymbol, setSelectedSymbol] = useState("")

  useEffect(() => {
    // In watch but not in state
    if(existSymbol.length > 0) {
      if(selectedSymbol === "") {
        setSelectedSymbol(watchList[0]);
      }
      const newS = watchList.filter( ele => !existSymbol.includes(ele) );
      Promise.all(newS.map( ele => {
        setExistSymbol( prev => [...prev, ele] )
        return fetchHistory(ele, ServerURL).then( res => res[0]);
      })).then(data => {
        setState( prev => prev.concat(data))
      });
    } else {
      if(selectedSymbol === "" && watchList.length > 0) {
        setSelectedSymbol(watchList[0]);
      }
      watchList.forEach(ele => {
        setExistSymbol( prev => [...prev, ele] )
        fetchHistory(ele, ServerURL)
          .then(res => {
            setState( prev => [...prev, res[0]]);
          });
      });
    }
  }, [watchList]);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <ScrollView>
          {state
            .sort( (a, b) => compare(a.symbol, b.symbol))
            .map( (data, index) => <Item data={data} onChangeSymbol={setSelectedSymbol} selected={selectedSymbol} key={index} />)}
        </ScrollView>
      </View>
      <View style={{flex:1}}>
        <ShowStockDetail stockData={state} selectedStock={selectedSymbol}/>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textwhite: {
    color: "white",
    fontSize: scaleSize(15)
  },
  textgray: {
    color: 'gray',
    fontSize: scaleSize(15)
  },
  redboard: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: scaleSize(5)
  },
  greenboard:{
    backgroundColor: 'green',
    borderRadius: 10,
    padding: scaleSize(5)
  },
  rootdetail: {
    flex: 1,
    backgroundColor: "#161616",
    width: 'auto',
    height: scaleSize(200)
  },
  detailname: {
    flex: 2,
    borderBottomColor: "#262325",
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailcontainer: {
    flex: 1,
    borderBottomColor: "#262325",
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  detailtext: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rootitemblack: {
    flex: 1, 
    height: 'auto',
    flexDirection: 'row',
    borderBottomColor: "#262325",
    borderBottomWidth: 2
  },
  rootitemgray: {
    flex: 1, 
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: '#3f4042',
    borderBottomWidth: 2
  },
  itemtext: {
    flex: 2, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaleSize(2),
    paddingRight: scaleSize(10)
  },
  itemboard: {
    flex: 1, 
    padding: scaleSize(10)
  },
  itemtextsize: {
    fontSize: scaleSize(20)
  },
  boardtext: {
    textAlign: 'right'
  }
});