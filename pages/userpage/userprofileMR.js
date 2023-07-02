import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';

const UserprofileMR = () => {
  const [showForm, setShowForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showRecycleForm, setShowRecycleForm] = useState(false);
  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    prepTime: '',
    servings: '',
    cookTime: '',
    origin: '',
    type: '',
    taste: '',
    category: '',
    instruction: '',
    selectedIngredient: '',
    ingredients: [],
  });

  const [recycleData, setRecycleData] = useState({
    name: '',
    description: '',
    prepTime: '',
    category: '',
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

    setRecycleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };
  const handleChangeRecycle = (e) => {
    const { name, value } = e.target;

    if (name === 'prepTime' || name === 'servings' || name === 'cookTime') {
        if (value < 0) {
          return;
        }
      }
      setRecycleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
};



  const handleSaveButton = () => {
    setShowForm(false);
    setShowRecipeForm(false);
    setShowRecycleForm(false);
  };

  const handleAddIngredient = () => {
    const { selectedIngredient, ingredients } = recipeData;
    if (selectedIngredient && !ingredients.includes(selectedIngredient)) {
      setRecipeData((prevData) => ({
        ...prevData,
        ingredients: [...ingredients, selectedIngredient],
      }));
    }
  };

 

  return (
    <>
      
      <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>

        <div style={{ marginRight: '10px' }}>
          <Link href="/all-menu" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            All menu
          </Link>
          <Link href="/planner" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            Planner
          </Link>
          <Link href="/recycle" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
            Recycle
          </Link>
          <Link href="#" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
            Profile
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <img src="../img/user-icon.png" alt="User Icon" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        <h3 style={{ marginTop: '20px' }}>Ahmad Yasi Faizi</h3>
        <p>u6238001@au.edu</p>
        <p>0981693530</p>
        <div style={{ marginTop: '50px' }}>
          <Link href="/my-recipe" passHref>
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
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={recipeData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={recipeData.description} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="prepTime">
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control type="number" name="prepTime" value={recipeData.prepTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="servings">
                  <Form.Label>Servings</Form.Label>
                  <Form.Control type="number" name="servings" value={recipeData.servings} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="cookTime">
                  <Form.Label>Cook Time</Form.Label>
                  <Form.Control type="number" name="cookTime" value={recipeData.cookTime} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="origin">
                  <Form.Label>Origin</Form.Label>
                  <Form.Control as="select" name="origin" value={recipeData.origin} onChange={handleChange}>
                    <option value="">Select Origin</option>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" name="type" value={recipeData.type} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="taste">
              <Form.Label>Taste</Form.Label>
              <Form.Control type="text" name="taste" value={recipeData.taste} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category" value={recipeData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="instruction">
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" value={recipeData.instruction} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="ingredient">
                  <Form.Label>Ingredient</Form.Label>
                  <Form.Control type="text" name="selectedIngredient" value={recipeData.selectedIngredient} onChange={handleChange} />
                  <Button variant="primary" onClick={handleAddIngredient} style={{width: "100%", marginTop: "5px", backgroundColor: "green"}}>Add Ingredient</Button>
                </Form.Group>
              </Col>
              
            
            </Row>
            

            <Form.Group controlId="selectedIngredients">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control as="select" name="selectedIngredients" value={recipeData.selectedIngredients} multiple disabled>
                {recipeData.ingredients.map((ingredient, index) => (
                  <option key={index}>{ingredient}</option>
                ))}
              </Form.Control>
            </Form.Group>

            
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRecipeFormClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSaveButton}>Save</Button>
        </Modal.Footer>
      </Modal>











      <Modal show={showRecycleForm} onHide={handleRecycleFormClose} centered>
      <Modal.Header closeButton>
          <Modal.Title>Recycle Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={recycleData.name} onChange={handleChangeRecycle} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={recycleData.description} onChange={handleChangeRecycle} />
            </Form.Group>

            <Col>
                <Form.Group controlId="prepTime">
                  <Form.Label>Prep Time</Form.Label>
                  <Form.Control type="number" name="prepTime" value={recycleData.prepTime} onChange={handleChangeRecycle} />
                </Form.Group>
              </Col>

            

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category" value={recycleData.category} onChange={handleChangeRecycle}>
                <option value="">Select Category</option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="instruction">
              <Form.Label>Instruction</Form.Label>
              <Form.Control as="textarea" name="instruction" value={recycleData.instruction} onChange={handleChangeRecycle} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRecycleFormClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSaveButton}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserprofileMR;