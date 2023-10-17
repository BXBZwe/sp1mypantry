import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, Grid, Text } from "@nextui-org/react";
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import Image from 'next/image';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [subcategoriesChecked, setSubcategoriesChecked] = useState({});
  const router = useRouter();

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
  var filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Filter posts based on searchQuery and selected subcategories
  // var filterPosts = posts.filter((post) =>
  //   post.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //   Object.keys(subcategoriesChecked).every((categoryId) =>
  //     Object.keys(subcategoriesChecked[categoryId]).some(
  //       (subcategory) =>
  //       //  subcategoriesChecked[categoryId][subcategory] &&
  //       {
  //         post.ingredients.some((ingredient) => {
  //
  //               ingredient.name.toLowerCase() === subcategory &&
  //               isSubcategoryChecked(categoryId, subcategory)
  //         }
  //         )
  //       }
  //     )
  //   )
  // );

  const filterPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      Object.keys(subcategoriesChecked).every((categoryId) =>
      Object.keys(subcategoriesChecked[categoryId]).some((subCategory) =>
          post.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase() === subCategory
          )
      ))
  )



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const clearSubcategories = () => {
    setSubcategoriesChecked({}); // Clear the selected subcategories
  };

  const signOut = () => {
    // Remove the JWT token
    localStorage.removeItem('token');
    
    // Redirect to login or another page
    window.location.href = '/';
}
  const categoriesData = [
    {
      id: 1,
      name: 'Meats',
      subcategories: ['bacon', 'ground beef', 'beef', 'ham', 'sausage',
        'pork loin', 'chicken', 'duck'],
    },
    {
      id: 2,
      name: 'Vegetables & Greens',
      subcategories: ['garlic', 'onion', 'pepper', 'carrot', 'tomato', 'potato',
        'avocado', 'cucumber'],
    },
    {
      id: 3,
      name: 'Seafood & Swaweed',
      subcategories: ['shrimp', 'crab', 'squid', 'lobster', 'lobster tail', 'salmon', 'tuna', 'whitefish', 'fish']
    },
    {
      id: 4,
      name: 'Fruites',
      subcategories: ['lime', 'apple', 'orange', 'banana', 'pineapple', 'mango', 'peach', 'date', 'coconut', 'pear', 'grape', 'pomogranate'],
    },
    {
      id: 5,
      name: 'Dairy & Eggs',
      subcategories: ['butter', 'eggs', 'milk', 'yougurt', 'sour cream', 'cream', 'condensed milk'],
    },
    {
      id: 6,
      name: 'Sugar & Sweeteners',
      subcategories: ['sugar', 'honey', 'syrup', 'chocolate', 'molasses'],
    },
    {
      id: 7,
      name: 'Grains & Cereals',
      subcategories: ['Rice', 'Pasta', 'Oats', 'Quinoa', 'Bareley', 'Cornmeal'],
    },
    // Add more categories as needed
  ];

  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter((id) => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };
  const toggleSubcategory = (categoryId, subcategory) => {
    setSubcategoriesChecked((prev) => {
      const updatedState = {
        ...prev,
        [categoryId]: {
          ...(prev[categoryId] || {}),
          [subcategory]: !prev[categoryId]?.[subcategory],
        },
      };
  
      // Remove subcategories with 'false' value
      for (let key in updatedState) {
        for (let prop in updatedState[key]) {
          if (updatedState[key][prop] === false) {
            delete updatedState[key][prop];
          }
        }
        
        // Remove empty categories
        if (Object.keys(updatedState[key]).length === 0) {
          delete updatedState[key];
        }
      }
      
      return updatedState;
    });
  };
  

  const stopPropagation = (e) => {
    e.stopPropagation();
    
  };


  //return the selected ingredients as true, others as false in an array
  //need to create an array of selected ingredients and filtered it against the filteredPosts array
  const isSubcategoryChecked = (categoryId, subcategory) => {
    const checkedSubCategories = subcategoriesChecked[categoryId]?.[subcategory] || false;
    //console.log(subcategory)
    //setSelectedSubcategories([...selectedSubcategories, subcategory])
    //console.log(filteredPosts.filter(((post) => post.ingredients.filter((ingredient) => selectedSubcategories.filter((selectedSubCategory) => ingredient.name == selectedSubCategory)))))
    
    return checkedSubCategories
    
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
  <style jsx>{`
  .custom-dropdown-menu {
    right: auto !important;
    left: 0 !important;
  }
`}</style>


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
                  <Nav.Link href="home" style={{ fontWeight: 'bold', color: 'white' }}>Recipe</Nav.Link>
                  <Nav.Link href="../userpage/mealplannermain">Planner</Nav.Link>
                  <Nav.Link href="../userpage/recyclehome">Recycle</Nav.Link>


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

          <div className="col-12 col-md-3 side-menu" style={{ paddingTop: '20px', backgroundColor: '#ffffff', overflow: 'hidden', height: '90%', overflowY: 'auto' }}>
            <h3 className="custom-cursive-font" style={{ textAlign: 'center', fontWeight: 'bold' }}>Recipe Generator</h3>
            <div className="side-menu">
              <ul className="list-group">
                {categoriesData.map((category) => (
                  <li
                    key={category.id}
                    className={`list-group-item ${openCategories.includes(category.id) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category.id)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: openCategories.includes(category.id) ? '#ffffff' : 'white',
                      color: openCategories.includes(category.id) ? 'black' : 'black',
                      transition: 'background-color 0.5s, color 0.5s',
                      outline: 'none',
                    }}
                  >
                    {category.name}

                    {openCategories.includes(category.id) && (
                      <ul className="list-group subcategories" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', listStyleType: 'none' }}>
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory} onClick={stopPropagation}>
                            <button
                              className={`btn btn-sm ${isSubcategoryChecked(category.id, subcategory) ? 'btn-success' : 'btn-light'}`}
                              onClick={() => toggleSubcategory(category.id, subcategory)}
                            >
                              {subcategory}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <button style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#0d6efd', marginTop: '20px' }} className="btn btn-light" onClick={clearSubcategories}>
                  Clear
                </button>
              </ul>
              
            </div>
          </div>
          <div className="col-sm" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
            <div className="scrollable-content">
              <Container fluid>
                <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={5} gap={2}>
                  {filterPosts.map((post, index) => (
                    <Col key={index}>
                      <Link href={`/userpage/recipe/${post._id}`} style={{ textDecoration: 'none' }}>
                        <Card isPressable>
                          <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                            {post.recipeimageUrl && <Image className="recipe-picture"style={{width: '100%'}} width = {175} height = {150} priority src={post.recipeimageUrl} alt="Uploaded Image" />}
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