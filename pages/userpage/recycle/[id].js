import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Itemprofile = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const {id} = router.query;
    const [recycle, setRecycle] = useState();

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/post/getrecycle?postId=${id}`);
          const data = await response.json();
          setRecycle(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      if (id) {
        fetchPost();
      }
    }, [id]);
  
    if (!recycle) {
      return <div>Loading...</div>;
    }

    const addrecyclewishlist = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 
        console.log("userID: ", userId);
        const response = await fetch('/api/wishlist/addrecyclewishlist', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({ userId: userId, recycleId: id }), // replace user.id and post.id with actual values
        });
        if(!response.ok){
          const errorMessage = await response.text();
          setErrorMessage(errorMessage);
        }
        else{
          setErrorMessage('');
        }

        console.log('Recycle Response: ', response);
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
          {recycle.recycleimageUrl && <img className="recycle-picture" style ={{ width: '100px', height: '100px',borderRadius: '50%',objectFit: 'cover',overflow: 'hidden'}}
          src={recycle.recycleimageUrl} alt="Uploaded Image" />}
          <h2 style={{fontFamily: 'Inter, sans-serif', font: 'bold' }}>{recycle.name}</h2>
          <button onClick={addrecyclewishlist}>Add to Wishlist</button>
          <p>{errorMessage}</p>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>{recycle.description}</h5>

          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center'}}>Preparation Time</th>
                <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{recycle.prepTime}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>{recycle.recycletype}</td>
              </tr>
            </tbody>
          </table>
          <h5 style={{fontFamily: 'Inter, sans-serif'}}>{recycle.instruction}</h5>
        </div>
      </div>
      
    </>
  );
};

export default Itemprofile;