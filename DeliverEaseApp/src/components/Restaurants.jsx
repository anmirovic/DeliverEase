import { useNavigate } from "react-router-dom";

const Restaurants = (props) => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/restaurant/${id}`)
    }
    
    return (
        <div className="row">
            {props.restaurants.map((restaurant, id)=>{
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

export default Restaurants;