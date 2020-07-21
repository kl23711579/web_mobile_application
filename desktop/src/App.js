import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Stock from './Stock';
import HistoryTable from './HistoryTable';
import { makeStyles } from '@material-ui/core/styles';
import ShowChartIcon from '@material-ui/icons/ShowChart';

const Home = () => {
  return (
    <div>
      <h1>Stock Prices <span> <ShowChartIcon style={{ fontSize: 40 }}/></span> </h1>
      <p>Welcome to the Stock Market Page. You may click on stocks to view all the stocks or search to view the latest 100 days of activity.</p>
    </div>
  );
}

function App() {

  const useStyles = makeStyles({
    root: {
      padding: '30px'
    },
    barSize: {
      fontSize: '25px',
      display: 'inline'
    }
  });

  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <div>
          <Link to={`/`}>
            <p className={classes.barSize}> Home</p>
          </Link>
          <p className={classes.barSize}> | </p>
          <Link to={`/all`}>
            <p className={classes.barSize}> Table</p>
          </Link>
        </div>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/all">
            <Stock />
          </Route>
          <Route path="/history/:code">
            <HistoryTable />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
