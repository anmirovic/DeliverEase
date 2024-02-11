import { useEffect, useState } from "react";
import Review from "./Review";
import Cookies from "js-cookie";

const Reviews = (props) => {
    const [reviews, setReviews] = useState([]);

    const fetchAllReviews = async () => { 
        try{
            const response = await fetch('https://localhost:7050/api/Review/GetReviewsForUser?userId='+props.user.id,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt')
            },
            credentials: 'include'
            });
    
            if(response.ok){
                const rev = await response.json();
                setReviews(rev);
            }
        }
        catch{
            setReviews([]);
        }
    }

    useEffect(()=>{
        fetchAllReviews();
    },[]);
    return(
        <div>
            {reviews?(
                reviews.map((review,id)=>{
                    return(
                        <Review review={review} key={id} fetchAllReviews={fetchAllReviews}/>
                        )
                })
            ):(
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Reviews;