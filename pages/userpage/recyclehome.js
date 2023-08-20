import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";


const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [recycles, setRecycles] = useState([]);

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

  return (
    <>
      <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
        <div>
          <input style={{ width: '300px' }} type="search" placeholder="Search" />
          <button style={{ backgroundColor: 'red' }} type="button">GO</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <Link href="home" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>All menu</span>
          </Link>
          <Link href="planner" passHref>
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

      <div style={{marginTop: '20px',marginBottom: '20px',backgroundColor: '#f5f5f5',width: '95%',
                  borderRadius: '10px',overflow: 'hidden',}}>
        <Grid.Container gap={2} justify="flex-start">
          {recycles.map((recycle, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card isPressable>
                <Card.Body css={{ p: 0 }}>
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <div key={recycle._id}>
                    <Link href= {`/userpage/recycle/${recycle._id}`} style={{textDecoration: 'none'}}>
                    <Text b>{recycle.name}</Text>
                    </Link>
                    </div>                    
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Pagination rounded total={10} initialPage={1} />
        </div>
      </div>

      <div style={{
          height: '653px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex', 
          justifyContent: 'space-between'
        }}>
        <div style={{ width: '20%',  height: '100%', backgroundColor: '#d9d9d9', padding: '10px' }}>
        <h3 style={{ marginLeft: '55px' }}>Recycle Type</h3>
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
        <div style={{ width: '80%',  height: '100%', backgroundColor: '#f5f5f5', padding: '10px' }}>
          <h2 style={{fontFamily: 'Inter, sans-serif', font: 'bold' }}>Different recycle item here</h2>


        </div>
      </div>
    </>
  );
};

export default HomePage;