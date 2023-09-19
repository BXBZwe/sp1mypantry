import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
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
                      href='../userpage/recyclehome'
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
            {recycle.recycleimageUrl && <img className="recycle-picture" style={{
                  width: '360px',
                  height: '300px',
                  objectFit: 'cover',
                  overflow: 'hidden',
                }}
          src={recycle.recycleimageUrl} alt="Uploaded Image" />}
          
          <h2 style={{fontFamily: 'cursive', font: 'bold', marginTop: '10px' }}>{recycle.name}</h2>
          <button onClick={addrecyclewishlist} style={{
                backgroundColor: '#0b5ed7',
                padding: '5px',
                borderRadius: '10%',
              }}>Add to Wishlist</button>
          <p>{errorMessage}</p>
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
              

              <table  class='table table-bordered border-primary' style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
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
              <h3 style={{ fontFamily: 'Cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>
              Description:
            </h3>
              <h5 style={{fontFamily: 'Inter, sans-serif'}}>{recycle.description}</h5>
              <br></br>
              <h3 style={{ fontFamily: 'Cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>
              Instructions:
            </h3>
              <h5 style={{fontFamily: 'Inter, sans-serif'}}>{recycle.instruction}</h5>



          </div>
          </div></div>

     
      
    </>
  );
};

export default Itemprofile;