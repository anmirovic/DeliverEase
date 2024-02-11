import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register= () => {
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(0);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Surname', surName);
        formData.append('Username', username);
        formData.append('Email', email);
        formData.append('Password', password);
        formData.append('PhoneNumber', phone);
        formData.append('Role', 'user');

        const response = await fetch('https://localhost:7050/api/User/Register',{
            method:'POST',
            body:formData,
        });

        if(response.ok){
            navigate('/login');
        }
    }
    
    return(
        <div>
            <form onSubmit={submit}>
                <div className="form-floating input-row">
                    <input className="form-control" placeholder="Name" required onChange={e => setName(e.target.value)}/>
                    <label >Name</label>
                </div>
                <div className="form-floating input-row">
                    <input className="form-control" placeholder="Last Name" required onChange={e => setSurName(e.target.value)}/>
                    <label >Surname</label>
                </div>
                <div className="form-floating input-row">
                    <input className="form-control" placeholder="Username" required onChange={e => setUserName(e.target.value)}/>
                    <label >Username</label>
                </div>
                <div className="form-floating input-row">
                    <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)}/>
                    <label >Email</label>
                </div>
                <div className="form-floating input-row">
                    <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                    <label >Password</label>
                </div>
                <div className="form-floating input-row">
                    <input type="tel" className="form-control" placeholder="Phone Number" required onChange={e => setPhone(e.target.value)}/>
                    <label >Phone</label>
                </div>
                <Link className="nav-link login-label" to={"/login"} >Already have an account?</Link>
                <button className="btn btn-primary w-100 py-2 mb-4" type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default Register;