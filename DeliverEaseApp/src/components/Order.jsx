import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const Order = (props) => {
    const [restaurant, setRestaurant] = useState();

    const [rating, setRating] = useState(1);

    const fetchRestaurant = async () => { 
        const response = await fetch('https://localhost:7050/api/Restaurant/GetRestaurantById?id='+props.restaurantId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('jwt')
        },
        credentials: 'include'
        });

        if(response.ok){
            const rest = await response.json();
            setRestaurant(rest);
            console.log(restaurant);
            console.log(props.meals);
        }
    }

    useEffect(()=>{
        fetchRestaurant();
    },[]);

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value, 10));
    };

    const submitReview = async () => {
        try {
            const response = await fetch('https://localhost:7050/api/Review/AddReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('jwt'),
                },
                credentials: 'include',
                body: JSON.stringify({
                    rating: rating,
                    userId: props.userId,
                    restaurantId: props.restaurantId,
                }),
            });

            if (response.ok) {
                console.log('Review added successfully');
                fetchRestaurant();
            } else {
                console.error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error.message);
        }
    };
    
    return(
        <div>
            {restaurant?(
                <div className="bg-light p-2">
                    <div>
                        {restaurant.name}
                    </div>
                    {props.meals.map((meal, id) => (
                        <div key={id} className="row">
                            <div className="col-4">{meal.name}</div>
                            <div className="col-4">{meal.description}</div>
                            <div className="col-4">${meal.price}</div>
                        </div>
                    ))}
                    <div className="mt-3">
                        <label>Rate the restaurant:</label>
                        <input type="number" value={rating} onChange={handleRatingChange} min="1" max="5" />
                        <button onClick={submitReview}>Submit Review</button>
                    </div>
                </div>
            ):(
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Order;