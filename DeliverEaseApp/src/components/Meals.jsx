import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Meal from './Meal';

const Meals = (props) => {
    const [user, setUser] = useState(null);

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
        console.log(user);
        }
    }

    useEffect(()=>{
        getUser();
    },[]);

    return (
        <div className="row">
            <h4>Meals</h4>
        {props.restaurant.meals.map((meal, id) => (
            <Meal key={id} meal={meal} id={id} user={user} restaurantId={props.restaurant.id}/>
        ))}
        </div>
    );
};

export default Meals;
