import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
     
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        if (data.isAdmin){
          router.push('adminpage/adminhome');
        } else {
          router.push('/userpage/home'); // Redirect to the home page on successful login
        }
      } else {
        const data = await response.json();
        setError(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: "url(https://picsum.photos/id/42/600/400)",
    
    backgroundSize: 'cover',
  };

  const loginBoxStyle = {
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '45px',
    borderRadius: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#BBE4BA',
    marginBottom: '0.5rem',
    width: '55%',
    margin: '10px 22% auto',
    
  };
  const buttonStyle2 = {
    backgroundColor: '#BBE4BA',
    marginBottom: '0.5rem',
    width: '55%',
    margin: '5px 22% auto',
    
  };

  return (
    
    <div style={containerStyle }>
      <div style={loginBoxStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '25px', fontFamily: 'cursive'}}>MyPantry</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name = "email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{marginBottom: '20px'}} className="form-group">
            <label>Password</label>
            <input
              type="password"
              name = "password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn my-auto" style={buttonStyle}>
            Login
          </button>
          <Link href="/signuppage">
          <button className="btn" style={buttonStyle2}>
            Sign up
          </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
