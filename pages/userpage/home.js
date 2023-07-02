import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
        <div>
          <input style={{ width: '300px' }} type="search" placeholder="Search" />
          <button style={{ backgroundColor: 'red' }} type="button">GO</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <Link href="/all-menu" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>All menu</span>
          </Link>
          <Link href="/planner" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Planner</span>
          </Link>
          <Link href="/recycle" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Recycle</span>
          </Link>
          <Link href="userprofileMR" >
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Profile</span>
          </Link>
        </div>
      </nav>

      <div style={{ backgroundColor: '#f2f2f2', padding: '20px', float: 'left', width: '20%', height: '1000px' }} className="container">
        <h3 style={{ marginLeft: '20px' }}>Recipe Generator</h3>
        <div>
          <button className="btn btn-link" onClick={toggleDropdown}>
            Categories
          </button>
          {showDropdown && (
            <div style={{ marginLeft: '20px' }}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="category1" />
                <label className="form-check-label" htmlFor="category1">
                  Category 1
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="category2" />
                <label className="form-check-label" htmlFor="category2">
                  Category 2
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="category3" />
                <label className="form-check-label" htmlFor="category3">
                  Category 3
                </label>
              </div>
            </div>
          )}
        </div>
        <button style={{marginLeft: '100px', marginTop: '20px'}} className="btn btn-primary" type="button">Submit</button>
      </div>
    </>
  );
};

export default HomePage;