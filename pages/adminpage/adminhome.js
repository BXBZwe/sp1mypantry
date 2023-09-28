import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import { Navbar, Nav, FormControl } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter users based on the search query or show all users if the query is empty
    const filtered = query
      ? users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.phone.toLowerCase().includes(query.toLowerCase())
        )
      : users;

    setFilteredUsers(filtered);
  };

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
      } catch (error) {
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
        <Navbar expand="lg" style={{ backgroundColor: '#d8456b' }}>
          <div className="container">
            <Navbar.Brand href="home" style={{ fontFamily: 'cursive', fontSize: '30px', paddingRight: '845px' }}>MyPantry</Navbar.Brand>

            <Navbar.Toggle aria-controls="navbarSupportedContent" />
            <Navbar.Collapse id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto" >


                <li className="nav-item" >
                  <a className="nav-link active" style={{ fontWeight: 'bold', color: 'white' }} aria-current="page" href="adminhome">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link " aria-current="page" href="adminprofile" style={{ color: 'white' }}>Profile</a>
                </li>
                <Dropdown >
                  <Dropdown.Toggle style={{ border: 'none', color: 'inherit', fontSize: 'inherit', color: 'white', backgroundColor: '#d8456b', paddingRight: '0px', paddingLeft: '0px', marginTop: '0px' }}><i className="fa fa-bell text-white"></i> {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</Dropdown.Toggle>
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


            </Navbar.Collapse>
          </div>
        </Navbar>

        <div className="col sm " style={{ backgroundColor: '#ffffff', overflow: 'hidden', textAlign: 'center', height: '90%' }}>
          <div className="content">

            <Tabs defaultActiveKey="user-list" onSelect={handleTabSelect} >
            <Tab eventKey="user-list" title="User List">
      <div className="container">
        <br />
        <div className="input-group mb-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search"
            style={{ width: '100%' }}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
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
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Tab>


              <Tab eventKey="item-list" title="Recipe Item List">
                <div className="container">
                  <br />
                  <div className="input-group mb-3">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th className="text-center">Item Name</th>
                          <th className="text-center">Meal Type</th>
                          <th className="text-center">Origin</th>
                          <th className="text-center">Uploader ID</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post, index) => (
                          <tr key={post._id}>
                            <td className="text-center">{post.name}</td>
                            <td className="text-center">{post.mealtype}</td>
                            <td className="text-center">{post.origin}</td>
                            <td className="text-center">{post.userId}</td>
                            <td className="text-center">
                              <Button variant="primary">Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab>

              <Tab eventKey="Recycleitem-list" title="Recycle Item List">
                <div className="container">
                  <br />
                  <div className="input-group mb-3">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th className="text-center">Item Name</th>
                          <th className="text-center">Recycle Type</th>
                          <th className="text-center">Uploader ID</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recycles.map((recycle, index) => (
                          <tr key={recycle._id}>
                            <td className="text-center">{recycle.name}</td>
                            <td className="text-center">{recycle.recycletype}</td>
                            <td className="text-center">{recycle.userId}</td>
                            <td className="text-center">
                              <Button variant="primary">Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab>


              <Tab eventKey="report-notice" title="Report">
                <div className="container">
                  <br />
                  <div className="input-group mb-3">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th className="text-center">Reported By</th>
                          <th className="text-center">Reason</th>
                          <th className="text-center">Post Type</th>
                          <th className="text-center">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report._id}>
                            <td className="text-center">{report.reportedName}</td>
                            <td className="text-center">{report.reason}</td>
                            <td className="text-center">{report.postType}</td>
                            <td className="text-center">
                              <Button variant="dark" onClick={() => handleShowDetails(report)}>
                                Details
                              </Button>
                              {/* Rest of your modal code here */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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