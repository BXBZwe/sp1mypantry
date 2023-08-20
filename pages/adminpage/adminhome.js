import React from 'react';
import { Tab, Tabs, Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';


function admin() {
  const handleTabSelect = (key) => {
    
  };

  return (
      <div>
              <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
                <div style={{ marginRight: '10px' }}>
                    <Link href="/adminpage/adminhome" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
                        Home
                    </Link>
                    <Link href="/adminpage/adminprofile" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                     Profile
                    </Link>
                </div>
            </nav>
      

      <div className="content">
       
        <Tabs defaultActiveKey="user-list" onSelect={handleTabSelect} >
          <Tab eventKey="user-list" title="User List">
            <div className="container">
              <h3 className="page-title">User List</h3>
              <div style={{ textAlign: 'center' }}>
                    <input style={{width: '50%'}} type="search" placeholder="Search" />
                    <button style={{padding: '3px', marginBottom: '5px', backgroundColor: 'green', color: 'white'}} className="btn btn-outline-success " type="submit">GO</button>
              </div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">User ID</th>
                    <th className="text-center">Username</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">Ahmad Yasi Faizi</td>
                    <td className="text-center">
                      <Button variant="danger">Ban</Button>
                    </td>
                    <td className="text-center">
                      <Button variant="secondary">Unban</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="item-list" title="Posted Item List">
            <div className="container">
              <h3 className="page-title">Posted Item List</h3>
              <div style={{ textAlign: 'center' }}>
                    <input style={{width: '50%'}} type="search" placeholder="Search" />
                    <button style={{padding: '3px', marginBottom: '5px', backgroundColor: 'green', color: 'white'}} className="btn btn-outline-success " type="submit">GO</button>
              </div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Item ID</th>
                    <th className="text-center">Item Name</th>
                    <th className="text-center">Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">Egg Fried Rice</td>
                    <td className="text-center">
                      <select className="form-select">
                        <option value="1">Recipe</option>
                        <option value="2">Recycle</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <Button variant="primary">Delete</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="report-notice" title="Report">
            <div className="container">
              <h3 className="page-title">Report Notice</h3>
              <div style={{ textAlign: 'center' }}>
                    <input style={{width: '50%'}} type="search" placeholder="Search" />
                    <button style={{padding: '3px', marginBottom: '5px', backgroundColor: 'green', color: 'white'}} className="btn btn-outline-success " type="submit">GO</button>
              </div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Product/User Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">Zwe Min Maw</td>
                    <td className="text-center">
                      <Button
                        variant="dark"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal
        show={false}
        onHide={() => {
          
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>This is the detail description of the item</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            
          }}>
            Decline
          </Button>
          <Button variant="primary" onClick={() => {
            
          }}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default admin;