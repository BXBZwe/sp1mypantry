import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
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
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn my-auto" style={buttonStyle }>
            Login
          </button>
          
          <button className="btn" style={buttonStyle2}>
            Sign up
          </button>
          <a style={{ margin: '10px 32% auto', fontSize: '10px'}} href="#">Forgot password?</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;