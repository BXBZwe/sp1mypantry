import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function adminsetting() {
  return (
    <div className="container " style={{padding: '15%'}}>

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

export default adminsetting;