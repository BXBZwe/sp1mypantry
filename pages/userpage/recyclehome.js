import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Modal, Row, Col} from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [recycles, setRecycles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecycles, setFilteredRecycles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/post/recycleposts');
        const data = await response.json();
        setRecycles(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchAllPosts();
  }, []);

  useEffect(() => {
    // Filter recycles based on search query
    const filteredRecycles = recycles.filter((recycle) =>
      recycle.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecycles(filteredRecycles);
  }, [searchQuery, recycles]);

  return (
    <>
      <div className='container-fluid'>
        <div className="row vh-100">
        <Navbar bg="primary" expand="lg" variant="dark">
                        <div className="container">
                            <Navbar.Brand href="home" style={{ fontFamily: 'cursive', fontSize: '30px', paddingRight: '845px' }}>MyPantry</Navbar.Brand>

                            <Navbar.Toggle aria-controls="navbarSupportedContent" />
                            <Navbar.Collapse id="navbarSupportedContent">

                                <Nav className="navbar-nav ml-auto">
                                    <Nav.Link href="home" >Recipe</Nav.Link>
                                    <Nav.Link href="../userpage/mealplannermain" >Planner</Nav.Link>
                                    <Nav.Link href="../userpage/recyclehome" style={{ fontWeight: 'bold', color: 'white' }}>Recycle</Nav.Link>


                                    <Nav.Link href="../userpage/userprofileMR">
                                        <i className="fa fa-user"></i>
                                    </Nav.Link>
                                    <Nav.Link href="#">
                                        <i className="fa fa-sign-out"></i>
                                    </Nav.Link>
                                </Nav>
                                <Dropdown>
                                    <Dropdown.Toggle className="custom-dropdown-menu"
                                        style={{ border: 'none', color: 'inherit', fontSize: 'inherit', color: 'white', paddingRight: '0px', paddingLeft: '0px', marginTop: '0px' }}>

                                        <i className="fa fa-bell " ></i>
                                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ right: 'auto', left: 0 }}>
                                        {notifications && notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => handleNotificationClick(notification._id)}
                                                    href={`/userpage/report/${notification.reportId}`}
                                                >
                                                    {notification.message}
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item>No new notifications</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Navbar.Collapse>
                        </div>
                    </Navbar>

                    <div className="col-12 col-md-3" style={{ paddingTop: '20px', backgroundColor: '#ffffff', overflow: 'hidden', height: '90%' }}>
  <h3 className="custom-cursive-font" style={{ textAlign: 'center', fontWeight: 'bold' }}>Recipe Generator</h3>
</div>
<div className="col-12 col-md-9" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
  <Grid.Container gap={2} justify="flex-start">
    {filteredRecycles.map((recycle, index) => (
      <Grid xs={1} sm={2} md={3} lg={2.1} xl={5} xxl={6} gap={2} key={index}>
        <Link href={`/userpage/recycle/${recycle._id}`} style={{ textDecoration: 'none' }}>
          <Card isPressable>
            <Card.Body css={{ alignItems: 'center', width: '100%' }}>
              {recycle.recycleimageUrl && (
                <img
                  className="recycle-picture"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', overflow: 'hidden' }}
                  src={recycle.recycleimageUrl}
                  alt="Uploaded Image"
                />
              )}
            </Card.Body>
            <Card.Footer css={{ justifyItems: 'flex-start' }}>
              <Row wrap="wrap" justify="space-between" align="center">
                <div key={recycle._id}>
                  <Text b>{recycle.name}</Text>
                </div>
              </Row>
            </Card.Footer>
          </Card>
        </Link>
      </Grid>
    ))}
  </Grid.Container>
</div>

        </div>
      </div>
    </>
  );
};

export default HomePage;
