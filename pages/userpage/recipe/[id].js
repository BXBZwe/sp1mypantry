import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dropdown, Modal } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import Image from 'next/image';

const Itemprofile = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [scaledServings, setScaledServings] = useState(1);
  const [scaleingredients, setScaledIngredients] = useState([]);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [scaledIngredientsVisible, setScaledIngredientsVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  const scalingfactors = {
    MEAT: 1,
    VEGETABLES: 1,
    SPICES_HERBS: 0.5,
    LIQUIDS: 0.75,
    GRAINS_STARCHES: 1,
    DAIRY: 0.75,
    OILS: 0.5,
    SUGARS_SWEETENERS: 0.5,
    FRUITS: 1,
    NUTS: 1,
    SAUCES: 0.75,
    BAKING_INGREDIENTS: 0.5,
    ALCOHOL: 0.5,
    OTHERS: 1,
  };

  const scaledIngredients = (ingredients, servings, originalServings) => {
    return ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: (
        (ingredient.quantity * servings * (scalingfactors[ingredient.category] || 1)) /
        originalServings
      ).toFixed(2),
    }));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getrecipe?postId=${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      setScaledIngredients(scaledIngredients(post.ingredients, scaledServings, post.servings));
    }
  }, [post, scaledServings]);

  const handleScaleIngredients = () => {
    setScaledIngredients(scaledIngredients(post.ingredients, scaledServings, post.servings));
    setScaledIngredientsVisible(true); // Show scaled ingredients
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const addrecipewishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      console.log('userID: ', userId);
      const response = await fetch('/api/wishlist/addrecipewishlist', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ userId: userId, postId: id }), // replace user.id and post.id with actual values
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage('');
      }

      console.log('Recipe Response: ', response);
    } catch (error) {
      console.error('Error:', error);
      console.log('An error occurred while adding the post to the wishlist.');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportedBy = localStorage.getItem('userId');
      const response = await fetch('/api/report/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          reportedBy,
          postType: 'recipe',
          reason,
          additionalDetails: details
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setShowReportModal(false);
      setReason('');
      setDetails('');
      alert('Report submitted successfully!');
      // Optionally, show a message to the user that the report has been submitted successfully
    } catch (error) {
      console.error('Error reporting:', error);
    }
  };
  const signOut = () => {
    // Remove the JWT token
    localStorage.removeItem('token');
    
    // Redirect to login or another page
    window.location.href = '/';
}

  return (
    <>
      <div className='container-fluid'>
        <div className='row vh-100'>
          <Navbar bg="primary" expand="lg" variant="dark">
            <div className="container">
              <Navbar.Brand href="../home" style={{ fontFamily: 'cursive', fontSize: '30px' }}>MyPantry</Navbar.Brand>
              <span style={{paddingRight: '845px'}}></span>
              <Navbar.Toggle aria-controls="navbarSupportedContent" />
              <Navbar.Collapse id="navbarSupportedContent">

                <Nav className="navbar-nav ml-auto">
                  <Nav.Link href="../home" >Recipe</Nav.Link>
                  <Nav.Link href="../mealplannermain" >Planner</Nav.Link>
                  <Nav.Link href="../recyclehome">Recycle</Nav.Link>


                  <Nav.Link href="../userprofile">
                    <i className="fa fa-user"></i>
                  </Nav.Link>
                  <Nav.Link onClick={signOut}>
                    <i className="fa fa-sign-out"></i>
                  </Nav.Link>
                </Nav>
                <Dropdown>
                  <Dropdown.Toggle className="custom-dropdown-menu"
                    style={{ border: 'none', fontSize: 'inherit', paddingRight: '0px', }}>
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
          <div className="col-12 col-md-4" style={{ width: '25%', paddingTop: '5px', backgroundColor: '#ffffff', overflowY: 'auto', textAlign: 'center', height: '90%' }}>
            {post.recipeimageUrl && (
              <Image
                className='recipe-picture'
                  width = {340}
                  height = {250}
                  priority
                src={post.recipeimageUrl}
                alt='Uploaded Image'
                style={{marginBottom: '10px', marginTop: '10px'}}
              />
            )}
            <h2 style={{ fontFamily: 'cursive', fontWeight: 'bold' }}>{post.name}</h2>
            <button
              onClick={addrecipewishlist}
              style={{
                backgroundColor: '#0b5ed7',
                padding: '5px 10px',
                borderRadius: '10%',
                marginBottom: '5px',
              }}
            >
              Add to Wishlist
            </button>
            <br />
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                backgroundColor: '#d8456b',
                padding: '5px 40px',
                borderRadius: '10%',
              }}
            >
              Report
            </button>

            <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Report Post</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label style={{ margin: '5px' }}>Reason:</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Misinformation">Misinformation</option>
                    <option value="Spam">Spam</option>
                    {/* Add other options if needed */}
                  </select>
                </div>
                <div>
                  <label style={{ margin: '6.5px' }}>Details:</label>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows="4"></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleReportSubmit}>
                  Submit Report
                </Button>
              </Modal.Footer>
            </Modal>
            <p>{errorMessage}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {post.ingredients &&
                  post.ingredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.quantity}</td>
                      <td>{ingredient.unit}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <input
              type='number'
              value={scaledServings}
              onChange={(e) => setScaledServings(e.target.value)}
              placeholder='Number of servings'
              style={{ margin: '10px 0' }}
            />
            <button onClick={handleScaleIngredients} style={{ marginBottom: '10px' }}>
              Scale Ingredients
            </button>

            {/* Display scaled ingredients under the button */}
            {scaledIngredientsVisible && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {scaleingredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.quantity}</td>
                      <td>{ingredient.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="col-sm" style={{ padding: '20px', backgroundColor: '#eceeee', height: '90%', overflowY: 'auto' }}>
            <table className="table table-bordered border-primary">
              <thead>
                <tr>
                  <th className="text-center">Category</th>
                  <th className="text-center">Origin</th>
                  <th className="text-center">Taste</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">{post.mealtype}</td>
                  <td className="text-center">{post.origin}</td>
                  <td className="text-center">{post.taste}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th className="text-center">Preparation Time</th>
                  <th className="text-center">Cooking Time</th>
                  <th className="text-center">Servings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">{`${post.prepTime.hours} hours ${post.prepTime.minutes} minutes`}</td>
                  <td className="text-center">{`${post.cookTime.hours} hours ${post.cookTime.minutes} minutes`}</td>
                  <td className="text-center">{post.servings}</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ fontFamily: 'cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>
              Description:
            </h3>
            <h5 style={{ fontFamily: 'cursive', whiteSpace: 'pre-line' }}>{post.description}</h5>
            <br />
            <h3 style={{ fontFamily: 'cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>Instruction:
            </h3>
            <h5 style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-line' }}>{post.instruction}</h5>
          </div>

        </div>
      </div>
    </>
  );
};

export default Itemprofile;
