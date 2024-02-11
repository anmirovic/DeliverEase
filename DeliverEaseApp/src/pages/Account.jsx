import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import AddRestaurant from "./AddRestaurant";
import { Link, useNavigate } from "react-router-dom";
import AdminRestaurants from "../components/Admin/AdminRestaurants";
import Orders from "../components/Orders";
import Reviews from "../components/Reviews";

const Account = (props) => {
    const [user, setUser] = useState(null);

    const [id, setId] = useState('')
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');

    const [changePassword, setChangePassword] = useState(false);

    const [ordersReviews, setOrdersReviews] = useState(true);

    const navigate = useNavigate();

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
            setId(content.id);
            setName(content.name);
            setSurName(content.surname);
            setUsername(content.username);
            setEmail(content.email);
            setPassword(content.password);
            setPhone(content.phoneNumber);
            setRole(content.role);
        }
    }
    
    useEffect(()=>{
        getUser();
    },[]);

    const update = async () => {
        const formData = new FormData();

        formData.append('Id', id);
        formData.append('Name', name);
        formData.append('Surname', surName);
        formData.append('Username', username);
        formData.append('Email', email);
        formData.append('Role', role);
        if(changePassword)
            formData.append('Password', password);
        else
            formData.append('Password', props.user.password);

        formData.append('PhoneNumber', phone);

        const response = await fetch('https://localhost:7050/api/User/UpdateUser?id='+id, {
            headers:{'Authorization': 'Bearer ' + Cookies.get('jwt')},
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });

        if(response.ok){
            props.setFetchUser(!props.fetchUser);
        }
    } 

    const handleCheckBox = () => {
        setChangePassword(!changePassword);
    }

    const handleOrderReviewClick = (value) => {
        setOrdersReviews(value);
    }

    const handleLogout = async () => {
        const response = await fetch('https://localhost:7050' + '/api/User/Logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt')
            },
            credentials: 'include'
        });
        
        if(response.ok){
            props.setFetchUser(!props.fetchUser);
            // navigate('/');
        }
        else{
            console.log('asd');
        }
    }

    return(
        <div className="settings-main">
            <div className="settings-content">
                <div className="settings-title-div">
                    <label className="setting-title">Profile settings</label>
                </div>
                <div className="settings-row">
                    <div className="settings-username">
                        <label className="settings-label">Username: </label>
                        <input type="text" className="form-control " placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                </div>
                <div className="settings-row row-name-lastname flex-wrap">
                    <div className="settings-name">
                        <label className="settings-label">Name:</label>
                        <input type="text" className="form-control input-name-lastname" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="settings-surname">
                        <label className="settings-label">Sur name: </label>
                        <input type="text" className="form-control input-name-surname" placeholder="Surname" required value={surName} onChange={(e) => setSurName(e.target.value)}/>
                    </div>
                </div>
                <div className="settings-row">
                    <label className="settings-label">Email: </label>
                    <input type="text" className="form-control settings-email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="settings-row">
                    <label className="settings-label">Phone: </label>
                    <input type="tel" className="form-control settings-phone" placeholder="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div className="settings-row">
                    <input type="checkbox" value="checkBoxValue" onChange={handleCheckBox}/>
                    <label className="settings-checkBox-lab">Change password</label>
                </div>
                <div className="settings-row">
                    <input type="password" className="form-control settings-input" placeholder="New password" disabled={!changePassword} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="settings-save">
                    <button className="btn btn-primary" onClick={update}>Save</button>
                </div>
            </div>
            <div>
                {user?(
                    <div>
                        <div className="row">
                            <div className="col-4" onClick={() => handleOrderReviewClick(true)}>Orders</div>
                            <div className="col-4" onClick={() => handleOrderReviewClick(false)}>Reviews</div>
                        </div>
                        {ordersReviews&&<Orders user={user}/>}
                        {!ordersReviews&&<Reviews user={user}/>}
                    </div>
                ):(
                    <div>Loading ...</div>
                )}
            </div>
            {role==='admin'&&(
                <div>
                    <Link to={'/addrestaurant'}>Add Restaurant</Link>
                    <div><AdminRestaurants/></div>
                </div>
            )}
            <div>
                <Link to={'/'} className="btn" onClick={handleLogout}>Logout</Link>
            </div>
        </div>
    );
}

export default Account;