import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [rating, setRating] = useState(0);
    const [meals, setMeals] = useState([]);

    const [mealName, setMealName] = useState('');
    const [mealDescription, setMealDescription] = useState('');
    const [mealPrice, setMealPrice] = useState();

    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();

        const newRestaurant = {
            name: name,
            address: address,
            rating: rating,
            meals: meals
        };

        const response = await fetch('https://localhost:7050/api/Restaurant/CreateRestaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRestaurant),
        });

        navigate('/account')
    }

    const handleOnClick = (e) => {
        e.preventDefault();
        
        if(mealName !== '' && mealDescription !== '' && mealPrice !== 0){
            const newMeal = {
                name: mealName,
                description: mealDescription,
                price: mealPrice
            };

            setMeals((prevMeals) => [...prevMeals, newMeal]);

            setMealName('');
            setMealDescription('');
            setMealPrice(0);
        }
    }
    
    return(
        <div>
            <form>
                <div className="form-floating input-row">
                    <input className="form-control" placeholder="Name" required onChange={e => setName(e.target.value)}/>
                    <label >Name</label>
                </div>
                <div className="form-floating input-row">
                    <input className="form-control" placeholder="Address" required onChange={e => setAddress(e.target.value)}/>
                    <label >Address</label>
                </div>
                <button onClick={submit}>Create Restaurant</button>
                {meals.map((meal, id) => {
                    return(
                        <div key={id}>
                            <div>
                                {meal.name}
                            </div>
                            <div>
                                {meal.description}
                            </div>
                            <div>
                                {meal.price}
                            </div>
                        </div>
                    )
                })}
                <div>
                    Add another meal
                    <div>
                        <div className="form-floating input-row">
                            <input className="form-control" placeholder="Meal name" value={mealName} onChange={e => setMealName(e.target.value)}/>
                            <label >Meal name</label>
                        </div>
                        <div className="form-floating input-row">
                            <input className="form-control" placeholder="Meal description" value={mealDescription} onChange={e => setMealDescription(e.target.value)}/>
                            <label >Meal description</label>
                        </div>
                        <div className="form-floating input-row">
                            <input className="form-control" placeholder="Meal price" value={mealPrice} onChange={e => setMealPrice(e.target.value)}/>
                            <label >Meal price</label>
                        </div>
                    </div>
                    <button onClick={handleOnClick}>Add</button>
                </div>
            </form>
        </div>
    );
}

export default AddRestaurant;