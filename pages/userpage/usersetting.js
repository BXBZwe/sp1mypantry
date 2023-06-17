import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
function usersetting() {
  return (
    <div className="container " style={{padding: '15%'}}>
      <FontAwesomeIcon icon={faUser} style={{fontSize: '100px', marginLeft: '45%', marginBottom: '20px'}}/>
      <h5 className="text-center">Ahmad Yasi Faizi</h5>
      <h5 className="text-center">u6238001@au.edu</h5>
      
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-success me-2">Sign Out</button>
        <br></br>
        <br></br>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </div>
  );
}

export default usersetting;