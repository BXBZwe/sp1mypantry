import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dropdown } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import Image from 'next/image';

const Itemprofile = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const [recycle, setRecycle] = useState();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recycles, setRecycles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecycles, setFilteredRecycles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const handleCheckboxChange = (event) => {
    const category = event.target.value;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };
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
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ userId: userId, recycleId: id }), 
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        setErrorMessage(errorMessage);
      }
      else {
        alert('The post has been added to wishlist.');
        setErrorMessage('');
      }

      console.log('Recycle Response: ', response);
    } catch (error) {
      console.error('Error:', error);
      console.log('An error occurred while adding the post to the wishlist.');
    }
    
  };
  
  const signOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}

const userId = localStorage.getItem('userId');

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
          <div className='col-md-4 col-lg-3 col-xl-3 col-xxl-3' style={{ width: '25%', paddingTop: '5px', backgroundColor: '#ffffff', overflowY: 'auto', textAlign: 'center', height: '90%' }}>
            {recycle.recycleimageUrl && (
              <Image
                className='recycle-picture'
                width = {340}
                height = {250} 
                  priority
                src={recycle.recycleimageUrl}
                alt='Uploaded Image'
              />
            )}
            <h2 style={{ fontFamily: 'cursive', fontWeight: 'bold', marginTop: '10px' }}>{recycle.name}</h2>
            {recycle.userId !== userId && <button onClick={addrecyclewishlist} style={{ backgroundColor: '#0b5ed7', padding: '5px 10px', borderRadius: '10%', marginBottom: '5px'}}>
              Add to Wishlist
            </button>}
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
            <table class='table table-bordered border-primary' style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', borderBottom: '1px solid black', textAlign: 'center' }}>Preparation Time</th>
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
            <h5 style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-line' }}>{recycle.description}</h5>
            <br></br>
            <h3 style={{ fontFamily: 'Cursive' }}>
              <i className='fa fa-star' style={{ paddingRight: '10px' }}></i>
              Instructions:
            </h3>
            <h5 style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-line' }}>{recycle.instruction}</h5>
          </div>
        </div></div>
    </>
  );
};

export default Itemprofile;