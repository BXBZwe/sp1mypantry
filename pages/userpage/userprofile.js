import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { Tab, Tabs, Modal, Row, Col } from 'react-bootstrap';
import { Card, Grid, Text, Pagination } from "@nextui-org/react";
import { useRouter } from 'next/router';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import Image from 'next/image';


const Userprofile = () => {
  const [currentTab, setCurrentTab] = useState("recipe-List");
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
  const [uppy, setUppy] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [recipeselectedFile, setRecipeselectedFile] = useState(null);
  const [recipeUppy, setRecipeUppy] = useState(null);
  const [recipeImageUrl, setRecipeImageUrl] = useState(null);
  const [recycleselectedFile, setRecycleselectedFile] = useState(null);
  const [recycleUppy, setRecycleUppy] = useState(null);
  const [recycleImageUrl, setRecycleImageUrl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wishlists, setWishlist] = useState([]);
  const [wishlistrecycles, setWishlistRecycle] = useState([]);

  const handleTabSelect = (selectedTab) => {
    setCurrentTab(selectedTab);
  }
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
        setRecycles(repostData);

        const responsewishlist = await fetch(`/api/wishlist/getwishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const wishlistData = await responsewishlist.json();
        console.log('Recipe Wishlist Data:', wishlistData);
        setWishlist(wishlistData);

        const responsewishlistrecycle = await fetch(`/api/wishlist/getwishlistrecycle`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const recyclewishlistData = await responsewishlistrecycle.json();
        console.log('Recycle Wishlist Data:', recyclewishlistData);
        setWishlistRecycle(recyclewishlistData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();

    const instance = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    });

    instance.use(XHRUpload, {
      endpoint: '/api/picupload',
      formData: true,
      fieldName: 'image',
    });

    instance.on('complete', (result) => {
      console.log('profile Picture Upload complete:', result);
      if (result.successful && result.successful.length > 0) {
        //console.log("Response body from upload:", result.successful[0].response.body);
        const uploadedImageUrl = result.successful[0].response.body.uploadURL;
        //console.log("Extracted URL:", uploadedImageUrl);

        setImageUrl(uploadedImageUrl);
        saveImageUrlToDB(uploadedImageUrl);
      }
    });

    const recipeinstnace = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    });

    recipeinstnace.use(XHRUpload, {
      endpoint: '/api/post/recipepicupload',
      formData: true,
      fieldName: 'image',
    });

    recipeinstnace.on('complete', (result) => {
      console.log("Recipe Picture upload Complete:", result);
      if (result.successful && result.successful.length > 0) {
        const recipeuploadImageUrl = result.successful[0].response.body.recipeuploadURL;

        setRecipeImageUrl(recipeuploadImageUrl);
      }
    });

    const recycleinstance = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    });

    recycleinstance.use(XHRUpload, {
      endpoint: '/api/post/recyclepicupload',
      formData: true,
      fieldName: 'image',
    });

    recycleinstance.on('complete', (result) => {
      console.log("Recycle Picture upload Complete:", result);
      if (result.successful && result.successful.length > 0) {
        const recycleuploadImageUrl = result.successful[0].response.body.recycleuploadURL;

        setRecycleImageUrl(recycleuploadImageUrl);
      }
    });


    setUppy(instance);
    setRecipeUppy(recipeinstnace);
    setRecycleUppy(recycleinstance);

    return () => {
      instance.close();
      recipeinstnace.close();
      recycleinstance.close();
    };

  }, []);

  const saveImageUrlToDB = async (uploadedImageUrl) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/user/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: uploadedImageUrl })
      });
      if (!response.ok) {
        throw new Error('Failed to save image URL');
      }
    } catch (error) {
      console.error('Error saving image URL:', error);
    }
  };


  const handleFileChange = (e) => {
    if (uppy) {
      uppy.addFile({
        name: e.target.files[0].name,
        type: e.target.files[0].type,
        data: e.target.files[0],
      });

      setSelectedFile(e.target.files[0]);
    }
  }


  const handleUpload = async (e) => {
    e.preventDefault();
    if (uppy) {
      uppy.upload();
    }
  }

  const recipehandleFileChange = (e) => {
    if (recipeUppy) {
      recipeUppy.addFile({
        name: e.target.files[0].name,
        type: e.target.files[0].type,
        data: e.target.files[0],
      });
      setRecipeselectedFile(e.target.files[0]);
    }
  }

  const recipehandleupload = async (e) => {
    e.preventDefault();
    if (recipeUppy) {
      recipeUppy.upload();
    }
  }

  const recyclehandleFileChange = (e) => {
    if (recycleUppy) {
      recycleUppy.addFile({
        name: e.target.files[0].name,
        type: e.target.files[0].type,
        data: e.target.files[0],
      });
      setRecycleselectedFile(e.target.files[0]);
    }
  }

  const recyclehandleupload = async (e) => {
    e.preventDefault();
    if (recycleUppy) {
      recycleUppy.upload();
    }
  }

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
    recipeimageUrl: '',
    instruction: '',
  });

  const [recycleData, setRecycleData] = useState({
    name: '',
    description: '',
    prepTime: '',
    recycletype: '',
    instruction: '',
    recycleimageUrl: '',
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
    // Prevent servings from going below 0
    if (name === 'servings') {
      if (value < 0) {
        return;
      }
    }
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Specialized handleChange for prepTime and cookTime
  const handleTimeChange = (timeType, unitType, value) => {
    if (value < 0) return;
    setRecipeData((prevData) => ({
      ...prevData,
      [timeType]: {
        ...prevData[timeType],
        [unitType]: parseInt(value),
      },
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
  const handleDeleteRecycle = async (recycleId) => {
    const token = localStorage.getItem('token');
    const responsedreccycle = await fetch(`/api/post/deleteRecycle/${recycleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (responsedreccycle.ok) {
      // Filter out the deleted recipe
      const updatedRecycles = recycles.filter(recycle => recycle._id !== recycleId);
      // Update the state
      setPosts(updatedRecycles);
    } else {
      // Handle the error
      console.error(`Failed to delete recipe with ID ${recycleId}`);
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
    if (updaterecipe) {
      handleUpdateRecipe(e);
    } else {
      try {
        if (recipeUppy) {
          await recipeUppy.upload();
        }
        const finalRecipeData = {
          ...recipeData,
          recipeimageUrl: recipeImageUrl

        };
        const token = localStorage.getItem('token');
        const response = await fetch('/api/post/recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(finalRecipeData)
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
          recipeimageUrl: '',
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
        if (recycleUppy) {
          await recycleUppy.upload();
        }

        const finalRecycleData = {
          ...recycleData,
          recycleimageUrl: recycleImageUrl
        };
        const token = localStorage.getItem('token');
        const response = await fetch('/api/post/recycle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(finalRecycleData)
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
          recycleimageUrl: ','
        });

        handleRecycleFormClose();

        router.reload(); // reload to show new post
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '', category: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };


  return (
    <>
      <div className='container-fluid'>
        <div className="row vh-100">
          <Navbar bg="primary" expand="lg" variant="dark">
            <div className="container">
              <Navbar.Brand href="home" style={{ fontFamily: 'cursive', fontSize: '30px' }}>MyPantry</Navbar.Brand>
              <span style={{paddingRight: '845px'}}></span>
              <Navbar.Toggle aria-controls="navbarSupportedContent" />
              <Navbar.Collapse id="navbarSupportedContent">

                <Nav className="navbar-nav ml-auto">
                  <Nav.Link href="home" >Recipe</Nav.Link>
                  <Nav.Link href="../userpage/mealplannermain" >Planner</Nav.Link>
                  <Nav.Link href="../userpage/recyclehome">Recycle</Nav.Link>


                  <Nav.Link href="../userpage/userprofile" style={{ fontWeight: 'bold', color: 'white' }}>
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
            {selectedFile && <p>{selectedFile.name}</p>}
            {imageUrl && <Image className="recipe-picture" style={{ borderRadius: '50%' }} width = {200}  height = {200} priority src={imageUrl} alt="Uploaded Image" />}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <div style={{ fontFamily: 'cursive', marginTop: '20px' }}>
              <h3 style={{ fontStyle: 'cursive', fontWeight: 'bold' }}>{name}</h3>
              <p>{email}<br />{phone}</p>
            </div>
            <div style={{ marginTop: '50px', height: "90%"}}>
              <Tabs defaultActiveKey="recipe-List" onSelect={handleTabSelect} >
                <Tab eventKey="recipe-List" title="MyRecipe"></Tab>
                <Tab eventKey="recycle-List" title="MyRecycle"></Tab>
                <Tab eventKey="wishlist" title="MyWishList"></Tab>
              </Tabs>
              <Button className="btn btn-primary" onClick={handleFormOpen}><i className="fa fa-plus"></i></Button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', height: '90%' }}>
            {currentTab === "recipe-List" &&
              <div className="col-sm " style={{ paddingTop: '20px', backgroundColor: '#eceeee', overflow: 'hidden', height: '90%', overflowY: 'auto' }}>
                <Grid.Container gap={2} justify="flex-start">
                  {posts.map((post, index) => (
                    <Grid xs={6} sm={2} md={3} lg={2.1} xl={5} xxl={5} gap={2} key={index}>
                      <Card isPressable >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <button
                            style={{ width: '40px', backgroundColor: '#0b5ed7' }}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this recipe?')) {
                                handleDeleteRecipe(post._id);
                              }
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          <button
                            style={{ width: '40px', backgroundColor: '#0b5ed7' }}
                            onClick={() => handleEditRecipe(post)}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                        </div>
                        <Link href={`/userpage/recipe/${post._id}`} style={{ textDecoration: 'none' }}>
                          <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                            {post.recipeimageUrl && <Image className="recipe-picture" width = {150} height = {150} priority
                              src={post.recipeimageUrl} alt="Uploaded Image" />}

                          </Card.Body>
                        </Link>
                        <Link href={`/userpage/recipe/${post._id}`} style={{ textDecoration: 'none' }}>
                          <Card.Footer css={{ justifyItems: "flex-start" }}>
                            <Row wrap="wrap" justify="space-between" align="center">
                              <div key={post._id}>

                                <Text b>{post.name}</Text>

                              </div>
                            </Row>
                          </Card.Footer>
                        </Link>
                      </Card>

                    </Grid>
                  ))}
                </Grid.Container>
              </div>
            }

            {currentTab === "recycle-List" &&
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
                            {recycle.recycleimageUrl && <Image className="recycle-picture" width = {150} height = {150} priority
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
            }

            {currentTab === "wishlist" &&
              <div className="col-sm " style={{ paddingTop: '20px', backgroundColor: '#eceeee', overflow: 'hidden', height: '90%', overflowY: 'auto' }}>
                <Grid.Container gap={2} justify="flex-start">
                  {wishlists.map((post, index) => (
                    <Grid xs={4.5} sm={4} md={3} lg={2.1} xl={5} xxl={6} gap={2} key={index}>
                      <Card isPressable>

                        <Card.Body css={{ alignItems: 'center', width: '100%' }}>
                          {post.recipeimageUrl && <Image className="recipe-picture" width = {150} height = {150} priority
                            src={post.recipeimageUrl} alt="Uploaded Image" />}

                        </Card.Body>
                        <Card.Footer css={{ justifyItems: "flex-start" }}>
                          <Row wrap="wrap" justify="space-between" align="center">
                            <div key={post._id}>
                              <Link href={`/userpage/recipe/${post._id}`} style={{ textDecoration: 'none' }}>
                                <Text b>{post.name}</Text>
                              </Link>
                            </div>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Grid>
                  ))}
                </Grid.Container>
              </div>
            }
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

          <Modal show={showRecipeForm} onHide={handleRecipeFormClose} centered >
            <Modal.Header closeButton>
              <Modal.Title>Recipe Form</Modal.Title>
            </Modal.Header>
            <Modal.Body >
              <Form >
                <Form.Group >
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" id="name" value={recipeData.name} onChange={handleChange} />
                </Form.Group>

                <Form.Group >
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="description" id="description" value={recipeData.description} onChange={handleChange} />
                </Form.Group>

                <Row >
                  <Col >
                    <Form.Group style={{ width: '150px' }}>
                      <Form.Label>Preparation Time:</Form.Label>
                      <Form.Label>Hours</Form.Label>
                      <Form.Control type="number" name="prepTimeHours" value={recipeData.prepTime.hours} onChange={(e) => handleTimeChange('prepTime', 'hours', e.target.value)} />
                      <Form.Label>Minutes</Form.Label>
                      <Form.Control type="number" name="prepTimeMinutes" value={recipeData.prepTime.minutes} onChange={(e) => handleTimeChange('prepTime', 'minutes', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group style={{ width: '130px' }} >
                      <Form.Label>Cooking Time</Form.Label>
                      <Form.Label>Hours</Form.Label>
                      <Form.Control type="number" name="cookTimeHours" value={recipeData.cookTime.hours} onChange={(e) => handleTimeChange('cookTime', 'hours', e.target.value)} />
                      <Form.Label>Minutes</Form.Label>
                      <Form.Control type="number" name="cookTimeMinutes" value={recipeData.cookTime.minutes} onChange={(e) => handleTimeChange('cookTime', 'minutes', e.target.value)} />
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
                      <Form.Label>Origin</Form.Label>
                      <Form.Control as="select" name="origin" id="origin" value={recipeData.origin} onChange={handleChange}>
                        <option value="">Select Origin</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Myanmar">Myanmar </option>
                        <option value="China">China </option>
                        <option value="Japan">Japan</option>
                        <option value="India">India </option>
                        <option value="Sounth_Korea">Sounth Korea </option>
                        <option value="Singapore">Singapore</option>
                        <option value="Vietnam">Vietnam </option>
                        <option value="Malaysia">Malaysia </option>
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
                        <Form.Control as="select" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}>
                          <option value="">Select Unit</option>
                          <option value="gram">Gram</option>
                          <option value="pieces">Pieces</option>
                          <option value="cuts">Cuts</option>
                          <option value="cups">Cups</option>
                          <option value="tbsp">Tbsp</option>
                          <option value="tsp">Tsp</option>
                          <option value="clove">Clove</option>
                          <option value="leaves">Leaves</option>
                          <option value="slices">Slices</option>
                          <option value="pitch">Pitch</option>
                          <option value="ml">ML</option>
                          <option value="pack">Pack</option>
                          <option value="scoop">Scoop</option>
                        </Form.Control>
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
                  <Button style={{ margin: '10px', padding: '5px' }} onClick={handleAddIngredient}>Add Ingredient</Button>
                </Form.Group>


                <Form.Group >
                  <Form.Label>Instruction</Form.Label>
                  <Form.Control as="textarea" name="instruction" id="instruction" value={recipeData.instruction} onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Recipe Image</Form.Label>
                  <input type="file" onChange={recipehandleFileChange} />
                  <button style={{ margin: '10px' }} onClick={recipehandleupload}>Upload</button>{recipeselectedFile && <p>{recipeselectedFile.name}</p>}
                  {recipeImageUrl && <Image className="recipe-picture" width = {100} height = {100} borderRadius = {50} 
                    src={recipeImageUrl} alt="Uploaded Image" />}
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
                    <option value="Thailand">Plant</option>
                    <option value="Myanmar">Animalfood</option>
                    <option value="China">FaceWash</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Instruction</Form.Label>
                  <Form.Control as="textarea" name="instruction" id="instruction" value={recycleData.instruction} onChange={handleChangeRecycle} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Recycle Image</Form.Label>
                  <input type="file" onChange={recyclehandleFileChange} />
                  <button style={{ margin: '5px' }} onClick={recyclehandleupload}>Upload</button>{recycleselectedFile && <p>{recycleselectedFile.name}</p>}
                  {recycleImageUrl && <Image className="recycle-picture" width = {100} height = {100} borderRadius = {50} 
                    src={recycleImageUrl} alt="Uploaded Image" />}
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
        </div>
      </div>
    </>
  );
};

export default Userprofile;

