import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Modal, Row, Col } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import Image from 'next/image';
import Container from 'react-bootstrap/Container';

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

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
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

    const fetchNotifications = async () => {
      const currentUserId = localStorage.getItem('userId');
      try {
        const response = await fetch(`/api/notification/notification?userId=${currentUserId}`);
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllPosts();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const filteredRecycles = recycles.filter((recycle) =>
      recycle.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecycles(filteredRecycles);
  }, [searchQuery, recycles]);

  const signOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }


  return (
    <>
      <div className='container-fluid'>
        <div className="row vh-100">
        <Navbar bg="primary" expand="lg" variant="dark">
            <div className="container">
              <Navbar.Brand href="home" style={{ fontFamily: 'cursive', fontSize: '30px' }}>MyPantry</Navbar.Brand>
              <span style={{paddingRight: '260px'}}></span>
              <Navbar.Toggle aria-controls="navbarSupportedContent" />
              <Navbar.Collapse id="navbarSupportedContent">
                <Form style={{ fontFamily: 'cursive', fontSize: '30px', paddingRight: '240px' }}>
                  <FormControl
                    type="search"
                    placeholder="Search"
                    className="mr-sm-2"
                    aria-label="Search"
                    style={{ width: '350px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                </Form>
                <Nav className="navbar-nav ml-auto">
                  <Nav.Link href="../userpage/home">Recipe</Nav.Link>
                  <Nav.Link href="../userpage/mealplannermain">Planner</Nav.Link>
                  <Nav.Link href="home" style={{ fontWeight: 'bold', color: 'white' }}>Recycle</Nav.Link>


                  <Nav.Link href="../userpage/userprofile">
                    <i className="fa fa-user"></i>
                  </Nav.Link>
                  <Nav.Link onClick={signOut}>
                    <i className="fa fa-sign-out"></i>
                  </Nav.Link>
                </Nav>
                <Dropdown>
                  <Dropdown.Toggle className="custom-dropdown-menu" id="notifications-dropdown" variant="transparent"
                    style={{ border: 'none', color: 'inherit', fontSize: 'inherit', color: 'white', paddingRight: '0px', paddingLeft: '0px', marginTop: '0px' }}>
                    <i className="fa fa-bell text-white"></i>
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ left: 'auto', right: 20 }}>
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
          <div className="col-sm" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
            <div className="scrollable-content">
              <Container fluid>
                <Row xs={1} sm={2} md={3} lg={2.5} xl={5} xxl={6.1} gap={2}>
                  {filteredRecycles.map((recycle, index) => (
                    <Col key={index}>
                      <Link href={`/userpage/recycle/${recycle._id}`} style={{ textDecoration: 'none' }}>
                        <Card isPressable>
                          <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                            {recycle.recycleimageUrl && (
                              <Image className="recycle-picture" style={{ width: '100%' }} width={175} height={150} priority src={recycle.recycleimageUrl} alt="Uploaded Image" />
                            )}
                          </Card.Body>
                          <Card.Footer css={{ justifyItems: "flex-start" }}>
                            <Row wrap="wrap" justify="space-between" align="center">
                              <div key={recycle._id}>
                                <Text b>{recycle.name}</Text>
                              </div>
                            </Row>
                          </Card.Footer>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
