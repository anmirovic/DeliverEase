import { useEffect, useState } from "react";
import Order from "./Order";
import Cookies from "js-cookie";

const Orders = (props) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => { 
        const response = await fetch('https://localhost:7050/api/Order/GetOrdersForUser?userId='+props.user.id,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('jwt')
        },
        credentials: 'include'
        });

        if(response.ok){
            const ord = await response.json();
            setOrders(ord);
            // console.log(props.user.id);
            // console.log(ord);
        }
    }

    useEffect(()=>{
        fetchAllOrders();
    },[]);

    return(
       <div>
            {orders?(
                orders.map((order,id)=>{
                    return(
                        <Order key={id} restaurantId={order.restaurantId} meals={order.meals} userId={props.user.id}/>
                        )
                })
            ):(
                <div>Loading...</div>
            )}
       </div> 
    );
}

export default Orders;