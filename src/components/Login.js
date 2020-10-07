import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import "./Login.scss";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // function validateForm() {
    //     return email.length > 0 && password.length > 0;
    // }

    // function handleSubmit(event) {
    //     event.preventDefault();
    // }

    const responseGoogle = (response) => {
        setName(response.profileObj.name);
        setEmail(response.profileObj.email);
        setUrl(response.profileObj.imageUrl);
    }

    const [name, setName] = useState("");

    const[url, setUrl] = useState("");

    return (
        
        <div className="Login">
            <h1>Google Login</h1>
            <h2>Welcome {name}</h2>
            <h2>Email: {email}</h2>
            <img src={url} alt={name}/>
            <GoogleLogin
            clientId = "16839305118-20p6nepats8u9tbbpj4lugu0n2oo8nu2.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            />
            {/* <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Login
            </Button>
            </form> */}
        </div>
        
    );
}