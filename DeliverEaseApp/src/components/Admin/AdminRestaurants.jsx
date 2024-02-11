import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const AdminRestaurants = (props) => {
    const navigate = useNavigate();

    const [allRestaurants, setAllRestaurants] = useState([]);

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

    const handleClick = (id) => {
        navigate(`/adminrestaurant/${id}`)
    }
    
    return (
        <div className="row">
            {allRestaurants.map((restaurant, id)=>{
                return(
                    <div key={id} className="col-4 mb-3 restaurant-card" onClick={() => handleClick(restaurant.id)}>
                        <div>
                            {restaurant.name}
                        </div>
                        <div>
                            {restaurant.address}
                        </div>
                        <div>
                            {restaurant.rating}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default AdminRestaurants;