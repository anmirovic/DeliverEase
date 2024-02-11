import React, { useEffect, useState } from 'react';
import Restaurants from '../components/Restaurants';
import Cookies from 'js-cookie';

const Home = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  
  const fetchAllRestaurants = async () => { 
    const response = await fetch('https://localhost:7050/api/Restaurant/GetAllRestaurants',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('jwt')
      },
      credentials: 'include'
    });

    if(response.ok){
      const restaurants = await response.json();
      setAllRestaurants(restaurants);
      console.log(allRestaurants);
    }
  }

  useEffect(()=>{
    fetchAllRestaurants();
  },[]);

  useEffect(()=>{
    const sortedRestaurants = [...allRestaurants].sort((a,b)=>b.rating - a.rating);
    const topThree = sortedRestaurants.slice(0,3);
    setTopRatedRestaurants(topThree);
  },[allRestaurants]);
  
  return (
    <div className="home">
      <section className="welcome-section">
        <h1>Welcome to Our Meal Order App</h1>
        <p>Discover delicious meals and place your order with ease.</p>
      </section>

      <section className="recommendation">
        <h2>Recommendation</h2>
        <Restaurants restaurants={topRatedRestaurants}/>
      </section>

      <section className="all">
        <h2>All Restaurants</h2>
        <Restaurants restaurants={allRestaurants}/>
      </section>
    </div>
  );
};

export default Home;