import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [recycles, setRecycles] = useState([]);

  useEffect(() => {
    const FetchAllusers = async () => {
      try {
        const response = await fetch('/api/user/getuser');
        const data = await response.json();
        setUsers(data);
      } catch(error) {
        console.error(error);
      }
    };
    const FetchAllPosts = async () => {
      try {
        const response = await fetch('/api/post/homeposts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    const FetchAllRecycles = async () => {
      try {
        const response = await fetch('/api/post/recycleposts');
        const data = await response.json();
        setRecycles(data);
      } catch (error) {
        console.error(error);
      }
    };

    FetchAllusers();
    FetchAllPosts();
    FetchAllRecycles();
  }, []);

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
                      <th className="text-center">Username</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Phone Number</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  {users.map((user, index) => (
                    <tbody>
                      <tr>
                        <td className="text-center">{user.name}</td>
                        <td className="text-center">{user.email}</td>
                        <td className="text-center">{user.phone}</td>
                        <td className="text-center">
                          <Button variant="danger">Ban</Button>
                        </td>
                        <td className="text-center">
                          <Button variant="secondary">Unban</Button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                  
                </Table>

            </div>
          </Tab>

          <Tab eventKey="item-list" title="Recipe Item List">
            <div className="container">
              <h3 className="page-title">Recipe Item List</h3>
              <div style={{ textAlign: 'center' }}>
                    <input style={{width: '50%'}} type="search" placeholder="Search" />
                    <button style={{padding: '3px', marginBottom: '5px', backgroundColor: 'green', color: 'white'}} className="btn btn-outline-success " type="submit">GO</button>
              </div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Item Name</th>
                    <th className="text-center">Meal Type</th>
                    <th className="text-center">Origin</th>
                    <th className="text-center">Uploader ID</th>
                    <th></th>
                  </tr>
                </thead>
                {posts.map((post, index) => (
                  <tbody>
                  <tr>
                    <td className="text-center">{post.name}</td>
                    <td className="text-center">{post.mealtype}</td>
                    <td className="text-center">{post.origin}</td>
                    <td className="text-center">{post.userId}</td>
                    <td className="text-center">
                      <Button variant="primary">Delete</Button>
                    </td>
                  </tr>
                </tbody>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab eventKey="Recycleitem-list" title="Recycle Item List">
            <div className="container">
              <h3 className="page-title">Recycle Item List</h3>
              <div style={{ textAlign: 'center' }}>
                    <input style={{width: '50%'}} type="search" placeholder="Search" />
                    <button style={{padding: '3px', marginBottom: '5px', backgroundColor: 'green', color: 'white'}} className="btn btn-outline-success " type="submit">GO</button>
              </div>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Item Name</th>
                    <th className="text-center">Recycle Type</th>
                    <th className="text-center">Uploader ID</th>
                    <th></th>
                  </tr>
                </thead>
                {recycles.map((recycle, index) => (
                  <tbody>
                  <tr>
                    <td className="text-center">{recycle.name}</td>
                    <td className="text-center">{recycle.recycletype}</td>
                    <td className="text-center">{recycle.userId}</td>
                    <td className="text-center">
                      <Button variant="primary">Delete</Button>
                    </td>
                  </tr>
                </tbody>
                ))}
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

export default Admin;