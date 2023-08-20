import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Itemprofile = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const {id} = router.query;
    const [post, setPost] = useState();
    const [scaledServings, setScaledServings] = useState(1);
    const [scaleingredients, setScaledIngredients] = useState([]);
    const [showScaleModal, setShowScaleModal] = useState(false);
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
          ingredient.quantity * servings * (scalingfactors[ingredient.category] || 1) / originalServings
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
      scaledIngredients(post.ingredients, scaledServings, post.servings);
      setShowScaleModal(true);
    };
    

    if (!post) {
      return <div>Loading...</div>;
    }

    const addrecipewishlist = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 
        console.log("userID: ", userId);
        const response = await fetch('/api/wishlist/addrecipewishlist', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({ userId: userId, postId: id }), // replace user.id and post.id with actual values
        });
        if(!response.ok){
          const errorMessage = await response.text();
          setErrorMessage(errorMessage);
        }
        else{
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
      <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
        <div>
          <input style={{ width: '300px' }} type="search" placeholder="Search" />
          <button style={{ backgroundColor: 'red' }} type="button">GO</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <Link href="home" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>All menu</span>
          </Link>
          <Link href="/planner" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Planner</span>
          </Link>
          <Link href="/recycle" passHref>
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Recycle</span>
          </Link>
          <Link href="userprofileMR" >
            <span style={{ margin: '0 10px', textDecoration: 'none', cursor: 'pointer' }}>Profile</span>
          </Link>
        </div>
      </nav>

      <div style={{height: '653px', width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ width: '20%', height: '100%', backgroundColor: '#d9d9d9', padding: '10px' }}>
        </div>
        <div style={{ width: '80%',  height: '100%', backgroundColor: 'white', padding: '10px' }}>
          <h2 style={{fontFamily: 'Inter, sans-serif', font: 'bold' }}>{post.name}</h2>
          <button onClick={addrecipewishlist}>Add to Wishlist</button>
          <p>{errorMessage}</p>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>{post.description}</h5>

          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center'}}>Category</th>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Origin</th>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Taste</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.mealtype}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.origin}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.taste}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center'}}>Preparation Time</th>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Cooking Time</th>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Servings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.prepTime}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.cookTime}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{post.servings}</td>
              </tr>
            </tbody>
          </table>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>Ingredients:</h5>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {post.ingredients && post.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.quantity}</td>
                  <td>{ingredient.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <input type="number" value={scaledServings} onChange={(e) => setScaledServings(e.target.value)}
          placeholder="Number of servings"/>
          <button onClick={handleScaleIngredients}>Scale Ingredients</button>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>Instruction:</h5>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>{post.instruction}</h5>
        </div>
      </div>
      {showScaleModal && (
        <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000,}}>
          <button onClick={() => setShowScaleModal(false)}>Close</button>
          <h5>Scaled Ingredients:</h5>
          <table>
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
        </div>
      )}
    </>
  );
};

export default Itemprofile;