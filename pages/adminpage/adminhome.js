import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

const Admin = () => {
  const handleTabSelect = (key) => {

  };
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [recycles, setRecycles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showAdminCommentModal, setShowAdminCommentModal] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);




  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  
  useEffect(() => {
    const FetchAllusers = async () => {
      try {
        const response = await fetch('/api/user/getuser');
        const data = await response.json();
        setUsers(data);
      } catch(error) {
        console.error(error);
      }
    };
    const FetchAllPosts = async () => {
      try {
        const response = await fetch('/api/post/homeposts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    const FetchAllRecycles = async () => {
      try {
        const response = await fetch('/api/post/recycleposts');
        const data = await response.json();
        setRecycles(data);
      } catch (error) {
        console.error(error);
      }
    };
    const FetchAllReports = async () => {
      try {
        const response = await fetch('/api/report/report');  // Assuming your API endpoint to fetch reports is '/api/reports'
        const data = await response.json();
        setReports(data);
        console.log("Fetched reports: ", data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchNotifications = async () => {
      const currentUserId = localStorage.getItem('userId');
      try {
        const response = await fetch(`/api/notification/notification?userId=${currentUserId}`); 
        const data = await response.json();
        setNotifications(data);
        console.log("notifications data :", data)
        setUnreadCount(data.length);
      } catch (error) {
        console.error(error);
      }
    };

    FetchAllusers();
    FetchAllPosts();
    FetchAllRecycles();
    FetchAllReports();
    fetchNotifications();
  }, []);

  const handleShowDetails = (report) => {
    setSelectedReportId(report._id);
    setModalData(report);
    setShowModal(true);
  };

  const handleAcceptReportWithComment = async () => {
    const currentUserId = localStorage.getItem('userId');
    try {
      const response = await fetch('/api/report/adminaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: selectedReportId,
          action: 'accepted',
          adminComment,
          currentUserId: currentUserId
        }),
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      alert('Report accepted successfully!');
      setShowAdminCommentModal(true);
      // TODO: update the UI, e.g., remove the report from the list, or update its status
    } catch (error) {
      console.error('Error accepting report:', error);
    }
  };
  
  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await fetch('/api/notification/notification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          status: 'read',
        }),
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };
  
  const handleDeclineReport = async () => {
    try {
      const response = await fetch('/api/report/adminaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: selectedReportId,
          action: 'declined'
        }),
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      alert('Report declined successfully!');
      // TODO: update the UI, e.g., remove the report from the list, or update its status
    } catch (error) {
      console.error('Error declining report:', error);
    }
  };

  const handleAdminCommentSubmit = async (e) => {
    e.preventDefault();
    const currentUserId = localStorage.getItem('userId');
    try {
      const response = await fetch('/api/report/adminaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: selectedReportId,
          action: 'accepted',
          adminComment,
          currentUserId: currentUserId 
        }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      alert('Admin comment submitted and report accepted successfully.');
      setShowAdminCommentModal(false); // close the modal
    } catch (error) {
      console.error('Error submitting admin comment:', error);
    }
  };
  
  
  return (
      <div className='container-fluid'>
        <div className="row vh-100">
        <nav style={{backgroundColor: '#d8456b', height: '10%'}} className="navbar navbar-expand-lg " >
        <div className="container-fluid" >
          <a className="navbar-brand custom-cursive-font" href="adminhome" ><h3 style={{color: 'white'}}>MyPantry - Admin</h3></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse"  id="navbarSupportedContent">
          <span className="navbar-nav  mx-auto"></span>
            <ul className="navbar-nav ml-auto" >
            
        
            <li className="nav-item" >
              <a className="nav-link active" style={{fontWeight: 'bold', color: 'white'}} aria-current="page" href="adminhome">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link "  aria-current="page" href="adminprofile" style={{ color: 'white'}}>Profile</a>
            </li>
            <Dropdown >
                <Dropdown.Toggle style={{ border: 'none', color: 'inherit', fontSize: 'inherit',  color: 'white', backgroundColor: '#d8456b', paddingRight:'0px', paddingLeft:'0px', marginTop: '0px'}}><i className="fa fa-bell text-white"></i> {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</Dropdown.Toggle>
                <Dropdown.Menu >
                  {notifications && notifications.length > 0 ? (notifications.map((notification, index) => (
                    <Dropdown.Item key={index} onClick={() => handleNotificationClick(notification._id)} 
                    href={`/userpage/report/${notification.reportId}`}>
                      {notification.message}
                    </Dropdown.Item>
                  ))
                  ) : (
                    <Dropdown.Item>No new notifications</Dropdown.Item>
                  )}
                </Dropdown.Menu>
            </Dropdown>
      
            </ul>
          </div>
        </div>
      </nav>
      <div className="col sm " style={{  backgroundColor: '#ffffff', overflow: 'hidden', textAlign: 'center',  height: '90%' }}>
      <div className="content">
       
        <Tabs defaultActiveKey="user-list" onSelect={handleTabSelect} >
          <Tab eventKey="user-list" title="User List" >
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            <div className="container" >
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th className="text-center">UserID</th>
                      <th className="text-center">Username</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Phone Number</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  {users.map((user) => (
                    <tbody key={user._id}>
                      <tr>
                        <td className="text-center">{user._id}</td>
                        <td className="text-center">{user.name}</td>
                        <td className="text-center">{user.email}</td>
                        <td className="text-center">{user.phone}</td>
                        <td className="text-center">
                          <Button variant="danger">Ban</Button>
                        </td>
                        <td className="text-center">
                          <Button variant="secondary">Unban</Button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
            </div>
          </Tab>

          <Tab eventKey="item-list" title="Recipe Item List">
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            
            <div className="container">
              
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Item Name</th>
                    <th className="text-center">Meal Type</th>
                    <th className="text-center">Origin</th>
                    <th className="text-center">Uploader ID</th>
                    <th></th>
                  </tr>
                </thead>
                {posts.map((post, index) => (
                  <tbody key={post._id}>
                  <tr>
                    <td className="text-center">{post.name}</td>
                    <td className="text-center">{post.mealtype}</td>
                    <td className="text-center">{post.origin}</td>
                    <td className="text-center">{post.userId}</td>
                    <td className="text-center">
                      <Button variant="primary">Delete</Button>
                    </td>
                  </tr>
                </tbody>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab eventKey="Recycleitem-list" title="Recycle Item List">
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
           
            <div className="container">
              
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Item Name</th>
                    <th className="text-center">Recycle Type</th>
                    <th className="text-center">Uploader ID</th>
                    <th></th>
                  </tr>
                </thead>
                {recycles.map((recycle, index) => (
                  <tbody key={recycle._id}>
                  <tr>
                    <td className="text-center">{recycle.name}</td>
                    <td className="text-center">{recycle.recycletype}</td>
                    <td className="text-center">{recycle.userId}</td>
                    <td className="text-center">
                      <Button variant="primary">Delete</Button>
                    </td>
                  </tr>
                </tbody>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab eventKey="report-notice" title="Report">
          <br></br>  
          <input style={{width: '30%'}} type="search" placeholder="Search" />
         
            <div className="container">
           
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="text-center">Reported By</th>
                    <th className="text-center">Reason</th>
                    <th className="text-center">Post Type</th>  
                    <th className="text-center">Details</th>
                  </tr>
                </thead>
                {reports.map((report) => (
                  <tbody key={report._id}>
                    <tr>
                      <td className="text-center">{report.reportedName}</td>
                      <td className="text-center">{report.reason}</td>
                      <td className="text-center">{report.postType}</td>  
                      <td className="text-center">
                      <Button variant="dark" onClick={() => handleShowDetails(report)}>
                        Details
                      </Button>
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Detail</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {modalData && (
                            <div>
                              <h4>Report Details</h4>
                              <p><strong>Reported By:</strong> {modalData.reportedName}</p>
                              <p><strong>Detail Reason:</strong> {modalData.additionalDetails}</p>
                              <p><strong>Post Type:</strong> {modalData.postType}</p>

                              <h4>Reported Post Details</h4>
                              <p><strong>Recipe Name:</strong> {modalData.receipeDetails.name}</p>
                              <p><strong>Description:</strong> {modalData.receipeDetails.description}</p>
                              <p><strong>prepTime:</strong> {modalData.receipeDetails.prepTime}</p>
                              <p><strong>servings:</strong> {modalData.receipeDetails.servings}</p>
                              <p><strong>cookTime:</strong> {modalData.receipeDetails.cookTime}</p>
                              <p><strong>origin:</strong> {modalData.receipeDetails.origin}</p>
                              <p><strong>taste:</strong> {modalData.receipeDetails.taste}</p>
                              <p><strong>mealtype:</strong> {modalData.receipeDetails.mealtype}</p>
                              <p><strong>instruction:</strong> {modalData.receipeDetails.instruction}</p>
                              <p><strong>Ingredients:</strong></p>
                              <ul>
                                {modalData.receipeDetails.ingredients.map((ingredient, index) => (
                                  <li key={index}>
                                    {`${ingredient.name} - ${ingredient.quantity}${ingredient.unit} (${ingredient.category})`}
                                  </li>
                                ))}
                              </ul>                              
                              <p><strong>recipeimageUrl:</strong> {modalData.receipeDetails.recipeimageUrl && 
                              ( <img className='recipe-picture' style={{width: '360px', height: '300px', objectFit: 'cover', overflow: 'hidden',}}
                              src={modalData.receipeDetails.recipeimageUrl} alt='Uploaded Image'/>
                              )}</p>
                              <p><strong>status:</strong> {modalData.receipeDetails.status}</p>

                            </div>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleDeclineReport}>
                            Decline
                          </Button>
                          <Button variant="primary" onClick={handleAcceptReportWithComment}>
                            Accept
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      <Modal show={showAdminCommentModal} onHide={() => setShowAdminCommentModal(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Admin Comments</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form.Control type="text" placeholder="Write your comment here" value={adminComment} onChange={(e) => setAdminComment(e.target.value)}/>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowAdminCommentModal(false)}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleAdminCommentSubmit}>
                          Submit
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal
        show={false}
        onHide={() => {
          
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>This is the detail description of the item</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            
          }}>
            Decline
          </Button>
          <Button variant="primary" onClick={() => {
            
          }}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
      </div>   
      </div>
    </div>
  );
}

export default Admin;