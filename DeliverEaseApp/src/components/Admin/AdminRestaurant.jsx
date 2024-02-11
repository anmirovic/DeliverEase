import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRestaurant = () =>{
    const { id } = useParams();

    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [rating, setRating] = useState(0);
    const [meals, setMeals] = useState([]);

    const [mealName, setMealName] = useState('');
    const [mealDescription, setMealDescription] = useState('');
    const [mealPrice, setMealPrice] = useState(0);

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
            setName(data.name);
            setAddress(data.address);
            setRating(data.rating);
            setMeals(data.meals);
        }
    };

    useEffect(()=>{
        fetchRestaurant();
    },[]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatePayload = {
            id: id,
            name: name,
            address: address,
            rating: rating,
            meals: meals
        };

        const response = await fetch(`https://localhost:7050/api/Restaurant/UpdateRestaurant?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('jwt'),
        },
        credentials: 'include',
        body: JSON.stringify(updatePayload),
        });

        if (response.ok) {
            console.log('Restaurant updated successfully');
          } else {
            console.error('Failed to update restaurant');
          }
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7050/api/Restaurant/DeleteRestaurant?id=${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt'),
                },
                credentials: 'include',
            });
        
            if (response.ok) {
                console.log('Restaurant deleted successfully');
                navigate('/account');
            } else {
                console.error('Failed to delete restaurant');
            }
        } catch (error) {
          console.error('Error:', error.message);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        const response = await fetch(`https://localhost:7050/api/Restaurant/DeleteMeal?restaurantId=${id}&mealId=${mealId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt'),
            },
            credentials: 'include',
        });

        if (response.ok) {
            const updatedMeals = meals.filter((meal) => meal.id !== mealId);
            setMeals(updatedMeals);
            console.log('Meal deleted from restaurant successfully.');
        } 
        else {
            console.error('Failed to delete meal from restaurant.');
        }
    }

    const handleAddMeal = async (e) => {
        e.preventDefault();

        
        
        if(mealName !== '' && mealDescription !== '' && mealPrice !== 0){
            const newMeal = {
                name: mealName,
                description: mealDescription,
                price: mealPrice
            };

            const response = await fetch(`https://localhost:7050/api/Restaurant/AddMeal?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('jwt'),
                },
                credentials: 'include',
                body: JSON.stringify(newMeal),
            });

            if (response.ok) {
                console.log('Meal added to restaurant successfully');
                fetchRestaurant();
            } else {
                console.error('Failed to add meal to restaurant');
            }

            // setMeals((prevMeals) => [...prevMeals, newMeal]);

            setMealName('');
            setMealDescription('');
            setMealPrice(0);

            // fetchRestaurant();
        }
    }

    return(
    <div className='w-25'>
        <h2>Edit Restaurant</h2>
        <form>
            <div className='mt-3'>
                <label>Name:</label>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-3'>
                <label>Address:</label>
                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className='d-flex flex-row justify-content-center mt-3'>
                <div className='m-2'>
                    <button type='button' className='btn btn-primary me-3' onClick={handleUpdate}><i className="bi bi-pencil-square"></i> Update</button>
                </div>
                <div className='m-2'>
                    <button type='button' className='btn btn-danger me-3' onClick={handleDelete}><i className="bi bi-trash"></i> Delete</button>
                </div>
            </div>
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
                <button onClick={handleAddMeal}>Add</button>
            </div>
            {meals.map((meal, id) => {
                return(
                    <div key={id} className='bg-light rounded p-2 m-3'>
                        <div>
                            {meal.name}
                        </div>
                        <div>
                            {meal.description}
                        </div>
                        <div>
                            ${meal.price}
                        </div>
                        <div className='m-2'>
                        {meals.length > 1 && (
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteMeal(meal.id)}>
                                <i className="bi bi-trash"></i> Delete Meal
                            </button>
                        )}
                        </div>
                    </div>
                )
            })}
        </form>
    </div>
    );
}

export default AdminRestaurant;