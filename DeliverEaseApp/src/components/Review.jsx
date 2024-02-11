import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Review = (props) => {
    const [restaurant, setRestaurant] = useState();
    const fetchRestaurant = async ()=>{
        const response = await fetch(`https://localhost:7050/api/Restaurant/GetRestaurantById?id=${props.review.restaurantId}`,{
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

    const handleDeleteReview = async () => {
        const response = await fetch(
            `https://localhost:7050/api/Review/DeleteReview?id=${props.review.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + Cookies.get("jwt"),
              },
              credentials: "include",
            }
          );
    
            if (response.ok) {
                console.log("Review deleted successfully");
                props.fetchAllReviews();
            } else {
                console.error("Failed to delete review");
            }
    } 
    return(
        <div>
            {restaurant ? (
                <div>
                <div>
                    {restaurant.name}
                </div>
                <div>
                    Rating: {props.review.rating}
                </div>
                <div>
                    <button className="btn btn-danger" onClick={handleDeleteReview}><i className="bi bi-trash"></i> Delete Review</button>
                </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Review;