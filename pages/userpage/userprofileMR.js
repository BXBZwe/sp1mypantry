import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { useRouter } from 'next/router';


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


const handleSubmitRecipe = async (e) => {
  e.preventDefault();

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
};

const handleSubmitRecycle = async (e) => {
  e.preventDefault();

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
};

  return (
    <>
      
      <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>

        <div style={{ marginRight: '10px' }}>
          <Link href="/home" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            All menu
          </Link>
          <Link href="/planner" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            Planner
          </Link>
          <Link href="/recycle" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            Recycle
          </Link>
          <Link href="/userprofileMR" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
            Profile
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <h3 style={{ marginTop: '20px' }}>{name}</h3>
        <p>{email}</p>
        <p>{phone}</p>
        <div style={{ marginTop: '50px' }}>
          <Link href="/userpage/userprofileMR" passHref>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>My Recipe</button>
          </Link>
          <Link href="/wishlist" passHref>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>Wishlist</button>
          </Link>
          <Link href="/recycle" passHref>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>My Recycle</button>
          </Link>
          <Button className="btn btn-primary" onClick={handleFormOpen}><i className="fas fa-plus">+</i></Button>
        </div>
        <div style={{ marginTop: '50px', marginBottom: '100%', backgroundColor: 'white' }}></div>
      </div>
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
                        <Link href= {`/userpage/recipe/${post._id}`} style={{textDecoration: 'none'}}>
                        <Text b>{post.name}</Text>
                        </Link>
                    </div>                    
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
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
              <Form.Control type="text" name="name" id = "name" value={recipeData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" id = "description" value={recipeData.description} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group >
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control type="number" name="prepTime" id = "prepTime" value={recipeData.prepTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Servings</Form.Label>
                  <Form.Control type="number" name="servings" id = "servings" value={recipeData.servings} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Cook Time</Form.Label>
                  <Form.Control type="number" name="cookTime" id = "cookTime" value={recipeData.cookTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Origin</Form.Label>
                  <Form.Control as="select" name="origin" id = "origin" value={recipeData.origin} onChange={handleChange}>
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
              <Form.Control type="text" name="taste" id ="taste" value={recipeData.taste} onChange={handleChange} />
            </Form.Group>

            <Form.Group >
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="mealtype" id = "mealtype" value={recipeData.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Maindish">Main dish</option>
                <option value="Dessert">Dessert </option>
                <option value="Salad">Salad </option>
              </Form.Control>
            </Form.Group>

            <Form.Group >
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" id = "instruction" value={recipeData.instruction} onChange={handleChange} />
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
              <Form.Control type="text" name="name" id ="name" value={recycleData.name} onChange={handleChangeRecycle} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" id = "description" value={recycleData.description} onChange={handleChangeRecycle} />
            </Form.Group>

            <Col>
                <Form.Group>
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control type="number" name="prepTime" id = "prepTime" value={recycleData.prepTime} onChange={handleChangeRecycle} />
                </Form.Group>
              </Col>

            

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="recycletype" id = "recycletype" value={recycleData.recycletype} onChange={handleChangeRecycle}>
              <option value="">Select Category</option>
              <option value="Lee">Plant</option>
              <option value="Myanmar">Animal </option>
              <option value="China">Hht </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" id = "instruction" value={recycleData.instruction} onChange={handleChangeRecycle} />
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


