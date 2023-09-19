import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

const Itemprofile = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [scaledServings, setScaledServings] = useState(1);
  const [scaleingredients, setScaledIngredients] = useState([]);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [scaledIngredientsVisible, setScaledIngredientsVisible] = useState(false); // New state

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

  return (
    <>
      <div className='container-fluid'>
        <div className='row vh-100'>
          <nav
            style={{ backgroundColor: '#d8456b', height: '10%' }}
            className='navbar navbar-expand-lg'
          >
            <div className='container-fluid'>
              <a className='navbar-brand custom-cursive-font' href='home'>
                <h3 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h3>
              </a>
              <button
                className='navbar-toggler'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#navbarSupportedContent'
                aria-controls='navbarSupportedContent'
              >
                <span className='navbar-toggler-icon'></span>
              </button>
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <span style={{ width: '1070px' }}></span>
                <ul className='navbar-nav ml-auto'>
                  <li className='nav-item'>
                    <a
                      className='nav-link '
                      style={{  color: 'white', fontFamily: 'cursive' }}
                      aria-current='page'
                      href='../home'
                    >
                      Recipe
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a
                      className='nav-link active'
                      aria-current='page'
                      href='/userpage/mealplannermain'
                      style={{ color: 'white', fontFamily: 'cursive' }}
                    >
                      Planner
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a
                      className='nav-link'
                      aria-current='page'
                      href='/userpage/recyclehome'
                      style={{ color: 'white', fontFamily: 'cursive' }}
                    >
                      Recycle
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a
                      className='nav-link'
                      aria-current='page'
                      href='/userpage/userprofileMR'
                      style={{ color: 'white' }}
                    >
                      <i className='fa fa-user'></i>
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' aria-current='page' href='#' style={{ color: 'white' }}>
                      <i className='fa fa-sign-out'></i>
                    </a>
                  </li>

                  <Dropdown>
                    <Dropdown.Toggle
                      style={{
                        border: 'none',
                        color: 'inherit',
                        fontSize: 'inherit',
                        color: 'white',
                        backgroundColor: '#d8456b',
                        paddingRight: '0px',
                        paddingLeft: '0px',
                        marginTop: '0px',
                      }}
                    >
                      <i className='fa fa-bell text-white'></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Notification 1</Dropdown.Item>
                      <Dropdown.Item>Notification 2</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </div>
          </nav>
          <div
            className='col-3 '
            style={{
              paddingTop: '20px',
              backgroundColor: '#ffffff',
              overflowY: 'Auto',
              textAlign: 'center',
              height: '90%',
            }}
          >
            {post.recipeimageUrl && (
              <img
                className='recipe-picture'
                style={{
                  width: '360px',
                  height: '300px',
                  objectFit: 'cover',
                  overflow: 'hidden',
                }}
                src={post.recipeimageUrl}
                alt='Uploaded Image'
              />
            )}
            <h2 style={{ fontFamily: 'cursive', font: 'bold' }}>{post.name}</h2>
            <button
              onClick={addrecipewishlist}
              style={{
                backgroundColor: '#0b5ed7',
                padding: '5px',
                borderRadius: '10%',
              }}
            >
              Add to Wishlist
            </button>
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
            />
            <button onClick={handleScaleIngredients}>Scale Ingredients</button>

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
          <div
            className='col-sm'
            style={{
              padding: '20px',
              backgroundColor: '#eceeee',
              height: '90%',
              overflowY: 'auto',
            }}
          >
            <table
              class='table table-bordered border-primary'
              style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Origin
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Taste
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.mealtype}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.origin}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.taste}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Preparation Time
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Cooking Time
                  </th>
                  <th
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    Servings
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.prepTime}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.cookTime}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    {post.servings}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ fontFamily: 'Cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>
              Ingredients:
            </h3>
            <h5 style={{ fontFamily: 'Cursive' }}>{post.description}</h5>
            <br></br>
            <h3 style={{ fontFamily: 'Cursive' }}>
              {' '}
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>Instruction:
            </h3>
            <h5 style={{ fontFamily: 'Inter, sans-serif' }}>{post.instruction}</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Itemprofile;
