import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [ password, setPassword] = useState('');

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        const response = await fetch(`https://localhost:7050/api/User/Login?email=${email}&password=${password}`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode:'cors',
        })

        if(response.ok){
            props.setFetchUser(!props.fetchUser);
            navigate('/');
        }
    }
    
    return(
        <div>
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Log in</h1>
                <div className="form-floating input-row">
                    <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)}/>
                    <label >Email address</label>
                </div>
                <div className="form-floating text-start input-row">
                    <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                    <label >Password</label>
                </div>
                <Link className="nav-link login-label" to={"/register"}>Don't have an account?</Link>
                <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            </form>
        </div>
    );
}

export default Login;