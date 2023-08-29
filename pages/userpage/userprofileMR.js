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
  const [updaterecipe, setUpdateRecipe] = useState();
  const [updaterecycle, setUpdateRecycle] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(null);
  const [imageSrc, setImageSrc] = useState('');



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
    const storedImageUrl = localStorage.getItem('uploadedImageUrl');
    if (storedImageUrl) {
      setUrl(storedImageUrl);
    }

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
    ingredients: [],
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
      ingredients: post.ingredients,
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
  recipeData.ingredients = ingredients;
  console.log("Submitting recipe data:", recipeData);
  if (updaterecipe){
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
        ingredients: [],
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

  if (updaterecycle){
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

const handleAddIngredient = () => {
  setIngredients([...ingredients, {name: '', quantity: 0, unit: '', category: ''}]);
};

const handleIngredientChange = (index, field, value) => {
  const newIngredients = [...ingredients];
  newIngredients[index][field] = value;
  setIngredients(newIngredients);
};

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  if (!file) return;

  setUploading(true);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/picupload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.url){
    localStorage.setItem('uploadedImageUrl', data.url);
    setUrl(data.url);
  }
  setUploading(false);
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
          <Link href="/userpage/userProfileWL" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
            Recycle
          </Link>
          <Link href="/userpage/userprofileMR" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
            Profile
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>Upload</button>{url && <img src={url}/>}
        <h3 style={{ marginTop: '20px' }}>{name}</h3>
        <p>{email}</p>
        <p>{phone}</p>
        <div style={{ marginTop: '50px' }}>
          <Link href="/userpage/userprofileMR" passHref>
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>My Recipe</button>
          </Link>
          <Link href="/userpage/userProfileWL" >
            <button className="btn btn-primary" style={{ marginRight: '10px' }}>Wishlist</button>
          </Link>
          <Link href="/userpage/userprofileRE" >
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
                    <button onClick={() => {if (window.confirm('Are you sure you want to delete this recipe?')) 
                    {handleDeleteRecipe(post._id)}}}>Delete</button>      
                    <button onClick={() => handleEditRecipe(post)}>Edit</button>
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
            <Form.Group>
              <Form.Label>Ingredients</Form.Label>
              {ingredients.map((ingredient, index) => (
              <Row key={index}>
                <Col>
                  <Form.Control type="text" placeholder="Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} />
                </Col>
                <Col>
                  <Form.Control type="number" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                </Col>
                <Col>
                  <Form.Control type="text" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} />
                </Col>
                <Col>
                  <Form.Control as="select" value={ingredient.category} onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}>
                    <option value=" ">Select Catagory</option>
                    <option value="MEAT">Meat</option>
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="SPICES_HERBS">SPICES HERBS</option>
                    <option value="LIQUIDS">LIQUIDS</option>
                    <option value="GRAINS_STARCHES">GRAINS STARCHES</option>
                    <option value="DAIRY">DAIRY</option>
                    <option value="OILS">OILS</option>
                    <option value="SUGARS_SWEETENERS">SUGARS SWEETENERS</option>
                    <option value="FRUITS">FRUITS</option>
                    <option value="NUTS">NUTS</option>
                    <option value="SAUCES">SAUCES</option>
                    <option value="BAKING_INGREDIENTS">BAKING INGREDIENTS</option>
                    <option value="ALCOHOL">ALCOHOL</option>
                    <option value="OTHERS">OTHERS</option>

                  </Form.Control>
                </Col>
              </Row>
              ))}
              <Button onClick={handleAddIngredient}>Add Ingredient</Button>
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


