import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

const Admin = () => {
  const handleTabSelect = (key) => {

  };
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [recycles, setRecycles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  
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

  return (
      <div className='container-fluid'>
        <div className="row vh-100">
        <nav style={{backgroundColor: '#d8456b', height: '10%'}} className="navbar navbar-expand-lg " >
        <div className="container-fluid" >
          <a className="navbar-brand custom-cursive-font" href="adminhome" ><h3 style={{color: 'white'}}>MyPantry - Admin</h3></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse"  id="navbarSupportedContent">
          <span className="navbar-nav  mx-auto"></span>
            <ul className="navbar-nav ml-auto" >
            
        
            <li className="nav-item" >
              <a className="nav-link active" style={{fontWeight: 'bold', color: 'white'}} aria-current="page" href="adminhome">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link "  aria-current="page" href="adminprofile" style={{ color: 'white'}}>Profile</a>
            </li>
            <Dropdown>
              <Dropdown.Toggle><i className="fas fa-bell"></i></Dropdown.Toggle>
                <Dropdown.Menu >
                  <Dropdown.Item>Notification 2</Dropdown.Item>
                    <Dropdown.Item >Notification 1</Dropdown.Item>
                  </Dropdown.Menu>
          </Dropdown>
      
            </ul>
          </div>
        </div>
      </nav>
      <div className="col sm " style={{  backgroundColor: '#ffffff', overflow: 'hidden', textAlign: 'center',  height: '90%' }}>
      <div className="content">
       
        <Tabs defaultActiveKey="user-list" onSelect={handleTabSelect} >
          <Tab eventKey="user-list" title="User List" >
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            <div className="container" >
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
                  {users.map((user) => (
                    <tbody key={user._id}>
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
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            
            <div className="container">
              
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
                  <tbody key={post._id}>
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
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            <div className="container">
              
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
                  <tbody key={recycle._id}>
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
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            <div className="container">
             
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
      
      
      </div>
              
      
            




    </div>
  );
}

export default Admin;