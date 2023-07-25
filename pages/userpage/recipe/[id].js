import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const itemprofile = () => {
    const router = useRouter();
    const {id} = router.query;
    const [post, setPost] = useState();

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
  
    if (!post) {
      return <div>Loading...</div>;
    }

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

      <div style={{
          height: '653px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex', 
          justifyContent: 'space-between'
        }}>
        <div style={{ width: '20%', height: '100%', backgroundColor: '#d9d9d9', padding: '10px' }}>

       


        </div>
        <div style={{ width: '80%',  height: '100%', backgroundColor: 'white', padding: '10px' }}>
          <h2 style={{fontFamily: 'Inter, sans-serif', font: 'bold' }}>{post.name}</h2>
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
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>{post.instruction}</h5>
        </div>
      </div>
      
    </>
  );
};

export default itemprofile;