import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Nav/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Account from './pages/Account';
import AddRestaurant from './pages/AddRestaurant';
import 'bootstrap/dist/css/bootstrap.min.css';
import Restaurant from './pages/Restaurant';
import AdminRestaurant from './components/Admin/AdminRestaurant';

function App() {
  const [user, setUser] = useState(null);
  const [fetchUser, setFetchUser] = useState(false);

  const getUser = async () => {
    const response = await fetch('https://localhost:7050' + '/api/User/GetUser', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
    });

    const content = await response.json();         
    if(response.ok){
      setUser(content);
      // console.log(user);
    }
    else
      setUser(null);
  }

  useEffect(()=>{
    getUser();
  },[]);

  useEffect(()=>{
    getUser();
    console.log('a');
  },[fetchUser]);

  return (
    <div className="App">
    <Router>
      <div className="app">
        <Navbar user={user} getUser={getUser}/>
        <div className="main d-flex justify-content-center">
          <Routes>
            <Route path="/" element={<Home/>} />
            {/* <Route path="/menu" component={Menu} />
            <Route path="/order-history" component={OrderHistoryPage} />*/}
            <Route path="/restaurant/:id" element={<Restaurant/>} />
            <Route path="/adminrestaurant/:id" element={<AdminRestaurant/>} />
            <Route path="/account" element={<Account user={user} getUser={getUser} fetchUser={fetchUser} setFetchUser={setFetchUser}/>} />
            <Route path="/login" element={<Login fetchUser={fetchUser} setFetchUser={setFetchUser}/>} /> 
            <Route path="/register" element={<Register/>} /> 
            <Route path="/addrestaurant" element={<AddRestaurant/>} /> 
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App
