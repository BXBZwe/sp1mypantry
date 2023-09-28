import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Modal, Row, Col } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
const UserprofileMR = () => {
  const [showForm, setShowForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showRecycleForm, setShowRecycleForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [recycles, setRecycles] = useState([]);
  const [updaterecipe, setUpdateRecipe] = useState();
  const [updaterecycle, setUpdateRecycle] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await fetch(`/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Profile response', response);
        const data = await response.json();
        console.log('Profile data:', data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setImageUrl(data.imageUrl);
        const responsepost = await fetch(`/api/post/recipe`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const postData = await responsepost.json();
        setPosts(postData);

        const responserecycle = await fetch(`/api/post/recycle`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const repostData = await responserecycle.json();
        setRecycles(repostData)

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    prepTime: '',
    servings: '',
    cookTime: '',
    origin: '',
    taste: '',
    category: '',
    instruction: '',
  });

  const [recycleData, setRecycleData] = useState({
    name: '',
    description: '',
    prepTime: '',
    recycletype: '',
    instruction: '',
  });




  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormOpen = () => {
    setShowForm(true);
  };

  const handleRecipeFormOpen = () => {
    setShowForm(false);
    setShowRecipeForm(true);
  };
  const handleReycleFormOpen = () => {
    setShowForm(false);
    setShowRecycleForm(true);
  }

  const handleRecipeFormClose = () => {
    setShowRecipeForm(false);
    setShowForm(true);
  };

  const handleRecycleFormClose = () => {
    setShowRecycleForm(false);
    setShowForm(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent prepTime, servings, and cookTime from going below 0
    if (name === 'prepTime' || name === 'servings' || name === 'cookTime') {
      if (value < 0) {
        return;
      }
    }

    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeRecycle = (e) => {
    const { name, value } = e.target;
    if (name === 'prepTime') {
      if (value < 0) {
        return;
      }
    }
    setRecycleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteRecipe = async (recipeId) => {
    const token = localStorage.getItem('token');
    const responsedrecipe = await fetch(`/api/post/deleteRecipe/${recipeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (responsedrecipe.ok) {
      // Filter out the deleted recipe
      const updatedRecipes = posts.filter(post => post._id !== recipeId);
      // Update the state
      setPosts(updatedRecipes);
    } else {
      // Handle the error
      console.error(`Failed to delete recipe with ID ${recipeId}`);
    }
  };
  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const responseurecipe = await fetch(`/api/post/updateRecipe/${updaterecipe}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipeData)
    });

    if (responseurecipe.ok) {
      setUpdateRecipe(null);  // Clear the currently editing ID
      router.reload();  // Reload to show updated post
    } else {
      console.error('Error updating recipe');
    }
  };

  const handleEditRecipe = (post) => {
    setRecipeData({
      name: post.name,
      description: post.description,
      prepTime: post.prepTime,
      servings: post.servings,
      cookTime: post.cookTime,
      origin: post.origin,
      taste: post.taste,
      category: post.category,
      instruction: post.instruction,
    });
    setUpdateRecipe(post._id);
    setShowRecipeForm(true);
  };

  const handleDeleteRecycle = async (recycleId) => {
    const token = localStorage.getItem('token');
    const responsedrecycle = await fetch(`/api/post/deleteRecycle/${recycleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (responsedrecycle.ok) {
      // Filter out the deleted recycle
      const updatedRecycles = recycles.filter(recycle => recycle._id !== recycleId);
      // Update the state
      setRecycles(updatedRecycles);
    } else {
      // Handle the error
      console.error(`Failed to delete recipe with ID ${recycleId}`);
    }
  };
  const handleUpdateRecycle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const responseurecycle = await fetch(`/api/post/updateRecycle/${updaterecycle}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recycleData)
    });

    if (responseurecycle.ok) {
      setUpdateRecycle(null);  // Clear the currently editing ID
      router.reload();  // Reload to show updated recycle
    } else {
      console.error('Error updating recycle post');
    }
  };

  const handleEditRecycle = (recycle) => {
    setRecycleData({
      name: recycle.name,
      description: recycle.description,
      prepTime: recycle.prepTime,
      recycletype: recycle.recycletype,
      instruction: recycle.instruction,
    });
    setUpdateRecycle(recycle._id);
    setShowRecycleForm(true);
  };



  const handleSubmitRecipe = async (e) => {
    e.preventDefault();

    if (updaterecipe) {
      handleUpdateRecipe(e);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/post/recipe', { // replace with your actual endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
          throw new Error('Error in submitting recipe');
        }

        setRecipeData({
          name: '',
          description: '',
          prepTime: '',
          servings: '',
          cookTime: '',
          origin: '',
          taste: '',
          category: '',
          instruction: '',
        });

        handleRecipeFormClose();

        router.reload(); // reload to show new post

      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitRecycle = async (e) => {
    e.preventDefault();

    if (updaterecycle) {
      handleUpdateRecycle(e);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/post/recycle', { // replace with your actual endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recycleData)
        });

        if (!response.ok) {
          throw new Error('Error in submitting recycle post');
        }

        setRecycleData({
          name: '',
          description: '',
          prepTime: '',
          recycletype: '',
          instruction: '',
        });

        handleRecycleFormClose();

        router.reload(); // reload to show new post

      } catch (error) {
        console.error(error);
      }
    }
  };


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
                  <Nav.Link href="../userpage/recyclehome">Recycle</Nav.Link>


                  <Nav.Link href="../userpage/userprofileMR" style={{ fontWeight: 'bold', color: 'white' }}>
                    <i className="fa fa-user"></i>
                  </Nav.Link>
                  <Nav.Link href="#">
                    <i className="fa fa-sign-out"></i>
                  </Nav.Link>
                </Nav>
                <Dropdown>
                  <Dropdown.Toggle className="custom-dropdown-menu"
                    style={{ border: 'none', fontSize: 'inherit', paddingRight: '0px', paddingLeft: '0px', marginTop: '0px' }}>

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
          <div className="col-12 col-md-3" style={{ paddingTop: '20px', backgroundColor: '#ffffff', overflowY: 'auto', textAlign: 'center', height: '90%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
              {imageUrl && <img className="recipe-picture" style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '50%', objectFit: 'cover' }} src={imageUrl} alt="Uploaded Image" />}
              <h3 style={{ marginTop: '5px' }}>{name}</h3>
              <p style={{ fontFamily: 'cursive' }}>{email} <br /> {phone}</p>
              <div style={{ marginTop: '5px' }}>
                <Link href="/userpage/userprofileMR" passHref>
                  <button className="btn btn-primary" style={{ marginRight: '10px' }}>My Recipe</button>
                </Link>
                <Link href="../userpage/userProfileWL" passHref>
                  <button className="btn btn-primary" style={{ marginRight: '10px' }}>Wishlist</button>
                </Link>
                <Link href="/userpage/userprofileRE" passHref>
                  <button className="btn btn-primary" style={{ marginRight: '10px', fontWeight: 'bold' }}>My Recycle</button>
                </Link>
                <Button className="btn btn-primary" onClick={handleFormOpen}><i className="fa fa-plus"></i></Button>
              </div>
            </div>
          </div>

          <div className="col-sm " style={{ paddingTop: '20px', backgroundColor: '#eceeee', overflow: 'hidden', height: '90%', overflowY: 'auto' }}>
            <Grid.Container gap={2} justify="flex-start">
              {recycles.map((recycle, index) => (
                <Grid xs={4.5} sm={3} md={3} lg={2.1} xl={5} xxl={6} gap={2} key={index}>
                  <Card isPressable>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button style={{ width: '40px', backgroundColor: '#0b5ed7' }} onClick={() => {
                        if (window.confirm('Are you sure you want to delete this recipe?')) { handleDeleteRecycle(recycle._id) }
                      }}><i className="fa fa-trash"></i></button>
                      <button style={{ width: '40px', backgroundColor: '#0b5ed7' }} onClick={() => handleEditRecycle(recycle)}>
                        <i className="fa fa-edit"></i></button></div>
                    <Link href={`/userpage/recycle/${recycle._id}`} style={{ textDecoration: 'none' }}>
                      <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                        {recycle.recycleimageUrl && <img className="recycle-picture" style={{ width: '150px', height: '150px', objectFit: 'cover', overflow: 'hidden' }}
                          src={recycle.recycleimageUrl} alt="Uploaded Image" />}

                      </Card.Body>
                    </Link>
                    <Link href={`/userpage/recycle/${recycle._id}`} style={{ textDecoration: 'none' }}>
                      <Card.Footer css={{ justifyItems: "flex-start" }}>
                        <Row wrap="wrap" justify="space-between" align="center">
                          <div key={recycle._id}>

                            <Text b>{recycle.name}</Text>

                          </div>

                        </Row>
                      </Card.Footer>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid.Container>


          </div>
        </div></div>



      <Modal show={showForm} onHide={handleFormClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Desired Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center">
              <Button variant="primary" style={{ width: '100%' }} onClick={handleRecipeFormOpen}>Recipe</Button>
            </Col>
            <Col className="text-center">

              <Button variant="primary" style={{ width: '100%' }} onClick={handleReycleFormOpen}>Recycle</Button>

            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFormClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRecipeForm} onHide={handleRecipeFormClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recipe Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group >
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" id="name" value={recipeData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" id="description" value={recipeData.description} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group >
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control type="number" name="prepTime" id="prepTime" value={recipeData.prepTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Servings</Form.Label>
                  <Form.Control type="number" name="servings" id="servings" value={recipeData.servings} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Cook Time</Form.Label>
                  <Form.Control type="number" name="cookTime" id="cookTime" value={recipeData.cookTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Origin</Form.Label>
                  <Form.Control as="select" name="origin" id="origin" value={recipeData.origin} onChange={handleChange}>
                    <option value="">Select Origin</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Myanmar">Myanmar </option>
                    <option value="China">China </option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group >
              <Form.Label>Taste</Form.Label>
              <Form.Control type="text" name="taste" id="taste" value={recipeData.taste} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="mealtype" id="mealtype" value={recipeData.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Maindish">Main dish</option>
                <option value="Dessert">Dessert </option>
                <option value="Salad">Salad </option>
              </Form.Control>
            </Form.Group>

            <Form.Group >
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" id="instruction" value={recipeData.instruction} onChange={handleChange} />
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRecipeFormClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmitRecipe}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRecycleForm} onHide={handleRecycleFormClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recycle Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" id="name" value={recycleData.name} onChange={handleChangeRecycle} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" id="description" value={recycleData.description} onChange={handleChangeRecycle} />
            </Form.Group>

            <Col>
              <Form.Group>
                <Form.Label>Prep Time</Form.Label>
                <Form.Control type="number" name="prepTime" id="prepTime" value={recycleData.prepTime} onChange={handleChangeRecycle} />
              </Form.Group>
            </Col>



            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="recycletype" id="recycletype" value={recycleData.recycletype} onChange={handleChangeRecycle}>
                <option value="">Select Category</option>
                <option value="Lee">Plant</option>
                <option value="Myanmar">Animal </option>
                <option value="China">Hht </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" id="instruction" value={recycleData.instruction} onChange={handleChangeRecycle} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRecycleFormClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmitRecycle}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserprofileMR;


