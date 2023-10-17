import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const handleSignup = async (e) => {
    e.preventDefault();

    //if (!validateEmail(email)) {
      //alert("Email must end with au.edu");
      //return;
    //}
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const { error } = await response.json();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //const validateEmail = (email) => {
    //const veamil = /^[a-zA-Z0-9._-]+@au\.edu$/;
    //return vemail.test(email);
  //};
  

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: "url(https://picsum.photos/id/42/600/400)",
    backgroundSize: 'cover',
  };

  const loginBoxStyle = {
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

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '25px', fontFamily: 'cursive' }}>MyPantry</h1>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="Enter text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'} 
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn "
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ backgroundColor: 'white', border: 'none' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <br></br>
          <button type="submit" className="btn my-auto" style={buttonStyle} onClick={handleSignup}>Sign Up</button>
          <Link href="../">
            <button className="btn" style={buttonStyle}>
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
