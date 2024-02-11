import { useState } from "react";
import Cookies from 'js-cookie'

const Meal = (props) => {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if(quantity>1)
            setQuantity(quantity-1);
    }

    const handleIncrease = () => {
        setQuantity(quantity+1);
    }

    const orderMeal = async (meal) => {
        try {
            
            const mealIds = Array.from({ length: quantity }, () => meal.id);
            console.log(mealIds);
            const response = await fetch(`https://localhost:7050/api/Order/CreateOrder?restaurantId=${props.restaurantId}&userId=${props.user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('jwt'),
                },
                credentials: 'include',
                body: JSON.stringify(mealIds),
            });

            if (response.ok) {
                console.log('Order placed successfully');
                setQuantity(1);
            } else {
                console.error('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error.message);
        }
    };

    return(
        <div key={props.id} className="col-4 mb-3 meal-card">
            <div>{props.meal.name}</div>
            <div>{props.meal.description}</div>
            <div>${props.meal.price}</div>
            <div>
                <button onClick={handleDecrease}>-</button>
                    {quantity}
                <button onClick={handleIncrease}>+</button>
            </div>
                <button onClick={() => orderMeal(props.meal)}>Order meal</button>
        </div>
    );
}

export default Meal;