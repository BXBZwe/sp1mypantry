import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [recycles, setRecycles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecycles, setFilteredRecycles] = useState([]);

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
          <nav style={{backgroundColor: '#d8456b', height: '10%'}} className="navbar navbar-expand-lg " >
            <div className="container-fluid" >
              <a className="navbar-brand custom-cursive-font" href="home" ><h3 style={{color: 'white', fontFamily: 'cursive'}}>MyPantry</h3></a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse"  id="navbarSupportedContent">
              <form className="d-flex mx-auto text-center">
                <input
                className="form-control me-1"
                type="search"
                placeholder="Search"
                aria-label="Search"  
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{width:'500px'}}
                /></form>
                
                <ul className="navbar-nav ml-auto" >
                
                  <li className="nav-item" >
                    <a className="nav-link " style={{ color: 'white', fontFamily: 'cursive'}} aria-current="page" href="home">Recipe</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active"  aria-current="page" href="../userpage/mealplannermain" style={{ color: 'white', fontFamily: 'cursive'}}>Planner</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="../userpage/recyclehome" style={{fontWeight: 'bold', color: 'white', fontFamily: 'cursive'}}>Recycle</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="../userpage/userprofileMR" style={{ color: 'white'}}><i className="fa fa-user"></i></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href='#' style={{ color: 'white'}}><i className="fa fa-sign-out"></i></a>
                  </li>
                  <Dropdown >
                    <Dropdown.Toggle style={{ border: 'none', color: 'inherit', fontSize: 'inherit',  color: 'white', backgroundColor: '#d8456b', paddingRight:'0px', paddingLeft:'0px', marginTop: '0px'}}><i className="fa fa-bell text-white"></i></Dropdown.Toggle>
                    <Dropdown.Menu >
                      <Dropdown.Item >Notification 1</Dropdown.Item>
                      <Dropdown.Item >Notification 2</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </div>
          </nav>
          <div className="col-3 " style={{ paddingTop: '20px', backgroundColor: '#ffffff', overflow: 'hidden',  height: '90%' }}>
            {/* Add content for the sidebar */}
          </div>
          <div className="col-sm" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
            <Grid.Container gap={2} justify="flex-start">
              {filteredRecycles.map((recycle, index) => (
                <Grid xs={6} sm={2} key={index}>
                  <Link href= {`/userpage/recycle/${recycle._id}`} style={{textDecoration: 'none'}}>
                    <Card isPressable>
                      <Card.Body css={{  alignItems: 'center', width: '100%'  }}>
                        {recycle.recycleimageUrl && <img className="recycle-picture" 
                        style ={{ width: '150px', height: '150px', objectFit: 'cover', overflow: 'hidden' }} src={recycle.recycleimageUrl} alt="Uploaded Image" />}
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
