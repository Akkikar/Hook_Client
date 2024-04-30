import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const CounterContext = React.createContext();

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COUNT':
      return { ...state, count: action.count };
    case 'SET_MY_COUNT':
      return { ...state, myCount: action.myCount };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'INCREMENT_MY':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MY':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>MyCounter Value: {state.myCount}</h1>
      <Link to="/counter">Counter</Link><br/>
      <Link to="/my-counter">MyCounter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounters = useCallback(async () => {
    try {
      const [counterResponse, myCounterResponse] = await Promise.all([
        axios.get('https://hook-server-nine.vercel.app/api/counter'),
      
      ]);
      dispatch({ type: 'SET_COUNT', count: counterResponse.data.count });
     
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  const incrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://hook-server-nine.vercel.app/api/counter/increment/${variable}`);
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://hook-server-nine.vercel.app/api/counter/decrement/${variable}`);
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);


  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      
      <button onClick={()=>incrementCounter('count')}>Increment Counter</button>
      <button onClick={()=>decrementCounter('count')}>Decrement Counter</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounters = useCallback(async () => {
    try {
      const [counterResponse, myCounterResponse] = await Promise.all([
        
        axios.get('https://hook-server-nine.vercel.app/api/counter')
      ]);
     
      dispatch({ type: 'SET_MY_COUNT', myCount: myCounterResponse.data.count1 });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  
  const incrementMyCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://hook-server-nine.vercel.app/api/counter/increment/${variable}`);
      dispatch({ type: 'INCREMENT_MY' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementMyCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://hook-server-nine.vercel.app/api/counter/decrement/${variable}`);
      dispatch({ type: 'DECREMENT_MY' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>My_Counter</h2>
     
      <p>MyCount: {state.myCount}</p>
      <button onClick={()=>incrementMyCounter('count1')}>Increment MyCounter</button>
      <button onClick={()=>decrementMyCounter('count1')}>Decrement MyCounter</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });
  useEffect(() => {
    const fetchInitialValues = async (variable) => {
      try {
        const response = await axios.get('https://hook-server-nine.vercel.app/api/counter');
        dispatch({ type: 'SET_COUNT', count: response.data.count });
      dispatch({ type: 'SET_MY_COUNT', myCount: response.data.count1 });
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialValues(); 
  },[]);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/my-counter">MyCounter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/my-counter" element={<MyCounter/>}/>
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
