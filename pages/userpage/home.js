import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Row } from 'react-bootstrap';
import { Card, Grid, Text} from "@nextui-org/react";
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);



  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
 
  useEffect(() => {
    const fetchAllPosts = async () => {
      const currentUserId = localStorage.getItem('userId');
      try {
        const response = await fetch('/api/post/homeposts');
        const data = await response.json();
        const filteredData = data.filter(post => 
          post.status === 'visible' || (post.status === 'underreview' && post.userId === currentUserId)
        );

        setPosts(filteredData);
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
        console.log("notifications data :", data)
        setUnreadCount(data.length);
      } catch (error) {
        console.error(error);
      }
    };
    

    fetchAllPosts();
    fetchNotifications();
  }, []);

  // Filter posts based on searchQuery
  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSignOut = () => {
    // You can implement your signout logic here.
    // For this example, we'll simply set isAuthenticated to false.
    setIsAuthenticated(false);
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await fetch('/api/notification/notification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          status: 'read',
        }),
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };
  
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
                onChange={handleSearchChange}
                style={{width:'500px'}}
              />
              
            </form>
            <ul className="navbar-nav ml-auto" >

            
            <li className="nav-item" >
              <a className="nav-link " style={{fontWeight: 'bold', color: 'white', fontFamily: 'cursive'}} aria-current="page" href="home">Recipe</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active"  aria-current="page" href="../userpage/mealplannermain" style={{ color: 'white', fontFamily: 'cursive'}}>Planner</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="../userpage/recyclehome" style={{ color: 'white', fontFamily: 'cursive'}}>Recycle</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="../userpage/userprofileMR" style={{ color: 'white'}}><i className="fa fa-user"></i>
</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href='#' style={{ color: 'white'}}><i className="fa fa-sign-out"></i></a>
            </li>
            
  
              <Dropdown >
                <Dropdown.Toggle style={{ border: 'none', color: 'inherit', fontSize: 'inherit',  color: 'white', backgroundColor: '#d8456b', paddingRight:'0px', paddingLeft:'0px', marginTop: '0px'}}><i className="fa fa-bell text-white"></i> {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</Dropdown.Toggle>
                <Dropdown.Menu >
                  {notifications && notifications.length > 0 ? (notifications.map((notification, index) => (
                    <Dropdown.Item key={index} onClick={() => handleNotificationClick(notification._id)} 
                    href={`/userpage/report/${notification.reportId}`}>
                      {notification.message}
                    </Dropdown.Item>
                  ))
                  ) : (
                    <Dropdown.Item>No new notifications</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </div>
      </nav>
          <div className="col-3 " style={{ paddingTop: '20px', backgroundColor: '#ffffff', overflow: 'hidden',  height: '90%' }}>
            <h3 className="custom-cursive-font" style={{textAlign: 'center', fontWeight: 'bold'}}>Recipe Generator</h3>
          <div class="card promoting-card">
              <div class="card-body d-flex flex-row">
                <div>
                  <h4 class="card-title font-weight-bold mb-2">New spicy meals</h4>
                  <p class="card-text"><i class="far fa-clock pr-2"></i>07/24/2018</p>
                </div>
              </div>
              <div class="view overlay">
                
                <a href="#!">
                  <div class="mask rgba-white-slight"></div>
                </a>
              </div>


              <div class="card-body">

                <div class="collapse-content">
                  <p class="card-text collapse" id="collapseContent">Recently, we added several exotic new dishes to our restaurant menu. They come from countries such as Mexico, Argentina, and Spain. Come to us, have some delicious wine and enjoy our juicy meals from around the world.</p>
                  <a class="btn btn-flat red-text p-1 my-1 mr-0 mml-1 collapsed" data-toggle="collapse" href="#collapseContent" aria-expanded="false" aria-controls="collapseContent"></a>
                  <i class="fas fa-share-alt text-muted float-right p-1 my-1" data-toggle="tooltip" data-placement="top" title="Share this post"></i>
                  <i class="fas fa-heart text-muted float-right p-1 my-1 mr-3" data-toggle="tooltip" data-placement="top" title="I like it"></i>
                </div>
              </div>
            </div>
          </div>

<div className="col-sm" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
  <div className="scrollable-content">
    <Grid.Container gap={2} justify="flex-start">
      {filteredPosts.map((post, index) => (
        <Grid xs={6} sm={2} key={index}>
          <Link href={`/userpage/recipe/${post._id}`} style={{ textDecoration: 'none' }}>
            <Card isPressable>
              <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                {post.recipeimageUrl && <img className="recipe-picture" style={{ width: '150px', height: '150px', objectFit: 'cover', overflow: 'hidden' }} src={post.recipeimageUrl} alt="Uploaded Image" />}
              </Card.Body>
              <Card.Footer css={{ justifyItems: "flex-start" }}>
                <Row wrap="wrap" justify="space-between" align="center">
                  <div key={post._id}>
                    <Text b>{post.name}</Text>
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
      </div>
    </>
  );
};

export default HomePage;