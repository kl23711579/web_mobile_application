import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, Text, ScrollView, TouchableOpacity} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

function getAllStockData(url) {
  const urlAll = url + "/all";
  return fetch(urlAll).then(res => res.json());
}

// row of stock list
const Item = ({symbol, name, addToWatchlist, navigation}) => {
  return(
    <TouchableOpacity 
      style={styles.itemRoot} 
      onPress={ () => {
        addToWatchlist(symbol); 
        navigation.navigate('Stocks');
        }}
    >
        <Text style={[styles.textcolor, styles.header]}>{symbol}</Text>
        <Text style={[styles.textcolor, styles.footer]}>{name}</Text>
    </TouchableOpacity>
  );
}

const StockList = ({ data, search, addToWatchlist, navigation }) => {
  const [stock, setStock] = useState([]);
  useEffect(()=> {
    const keyword = search.toLowerCase();
    if(search){
      const result = data.filter(ele => {return ele.symbol.toLowerCase().includes(keyword) || ele.name.toLowerCase().includes(keyword)});
      setStock(result);
    } else {
      setStock([]);
    }
  },[search]);
  
  return(
    <View >
      {search !== "" && 
      stock.map( (element, index) => <Item symbol={element.symbol} name={element.name} addToWatchlist={addToWatchlist} key={index} navigation={navigation}/> )}
    </View>
  );
}


export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [allStockPriceData, setAllStockPriceData] = useState([]);
  const [search, onChangeSearch] = useState("")


  useEffect(() => {
    getAllStockData(ServerURL)
      .then( res => {
        setAllStockPriceData(res);
      })
      .catch()
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={{color: "white",textAlign: "center", fontSize: scaleSize(20)}}>Type a company name or stock symbol</Text>
        <View style={styles.searchBar}>
          <Ionicons name="ios-search" size={scaleSize(24)} color="white" style={styles.searchicon}/>
          <TextInput 
            style={{ flex: 1, color: "white", fontSize: scaleSize(20) }}
            placeholder="Search"
            clearButtonMode={'while-editing'}
            value={search}
            onChangeText={text => onChangeSearch(text)} 
          />
        </View>
        <ScrollView>
          <StockList data={allStockPriceData} search={search} addToWatchlist={addToWatchlist} navigation={navigation}/>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textcolor: {
    color: "white"
  },
  textinput: {
    height: scaleSize(50),
    backgroundColor: "#262325",
    borderRadius: 5
  },
  itemRoot: {
    height: scaleSize(50),
    borderBottomColor: "#262325",
    borderBottomWidth: 2
  },
  header: {
    fontSize: scaleSize(20),
    paddingLeft: scaleSize(5)
  },
  footer: {
    fontSize: scaleSize(15),
    paddingLeft: scaleSize(5),
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262325',
    borderWidth: .5,
    borderColor: '#262325',
    height: scaleSize(50),
    borderRadius: 5 ,
    margin: scaleSize(10)
  },
  searchicon: {
    alignItems: 'center',
    padding: scaleSize(10),
    margin: scaleSize(5),
  }
});