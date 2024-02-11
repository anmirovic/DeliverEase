import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Meals from '../components/Meals';

const Restaurant = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState();

  const fetchRestaurant = async ()=>{
    const response = await fetch(`https://localhost:7050/api/Restaurant/GetRestaurantById?id=${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('jwt')
        },
        credentials: 'include'
    });

    if(response.ok){
      const data = await response.json();
        // console.log(data);
        setRestaurant(data);
    }
  };

  useEffect(()=>{
    fetchRestaurant();
  },[]);

  return (
    <div>
        {restaurant ? (
        <div>
          <div><h2>{restaurant.name}</h2></div>
          <div><h4>{restaurant.address}</h4></div>
          <div>{restaurant.rating}</div>
          <Meals restaurant={restaurant}/>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Restaurant;
