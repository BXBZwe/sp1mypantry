import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <nav style={{ backgroundColor: '#47974F', padding: '10px' }} className="navbar navbar-expand-lg navbar-light">
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
        <div style={{ width: '60%', marginLeft: '25%' }} className="input-group">
          <input style={{ width: '300px' }} type="search" placeholder="Search" />
          <button style={{ backgroundColor: 'red' }} className="btn btn-success" type="button">GO</button>
        </div>
        <ul style={{ width: '400px', fontFamily: 'cursive' }} className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">All Menu</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Meal Planner</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Recycle</a>
          </li>
        </ul>
      </nav>

      <div style={{ backgroundColor: '#f2f2f2', padding: '20px', float: 'left', width: '20%' }} className="container">
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
        <button className="btn btn-primary" type="button">Submit</button>
      </div>
    </>
  );
};

export default HomePage;