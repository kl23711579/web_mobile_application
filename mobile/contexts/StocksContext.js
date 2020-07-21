import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // load stock from phone storage
  const loadFromDisk = async () => {
    try {
      const dataFromDisk = await AsyncStorage.getItem("stock");
      if (dataFromDisk != null) setState(JSON.parse(dataFromDisk));
    } catch {
      alert("Disk corrupted");
    }
  }

  // add stock to watchlist and store in phone storage
  async function addToWatchlist(newSymbol) {
    if(state.indexOf(newSymbol) === -1) {
      const newState = [...state, newSymbol];
      try{
        await AsyncStorage.setItem("stock", JSON.stringify(newState));
        setState(newState);
      } catch {
        alert("There was an error saving.");
      }
    }
  }

  useEffect(() => {
    loadFromDisk();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
