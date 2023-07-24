import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { useRouter } from 'next/router';


const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState();


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/post/homeposts');
        const data = await response.json();
        setPosts(data);
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
          <Link href="/all-menu" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>All menu</span>
          </Link>
          <Link href="/planner" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Planner</span>
          </Link>
          <Link href="/recycle" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Recycle</span>
          </Link>
          <Link href="/userpage/userprofileMR" >
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Profile</span>
          </Link>
        </div>
      </nav>

      <div style={{marginTop: '20px',marginBottom: '20px',backgroundColor: '#f5f5f5',width: '95%',
                  borderRadius: '10px',overflow: 'hidden',}}>
        <Grid.Container gap={2} justify="flex-start">
          {posts.map((post, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card isPressable>
                <Card.Body css={{ p: 0 }}>
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <div key={post._id}>
                    <Link href= {`/userpage/post/${post._id}`} style={{textDecoration: 'none'}}>
                    <Text b>{post.name}</Text>
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
      <div style={{ backgroundColor: '#f2f2f2', padding: '20px', float: 'left', width: '20%', height: '1000px' }} className="container">
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
        <button style={{marginLeft: '100px', marginTop: '20px'}} className="btn btn-primary" type="button">Submit</button>
      </div>
    </>
  );
};

export default HomePage;