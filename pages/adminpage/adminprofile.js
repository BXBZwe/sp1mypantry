import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Image from 'next/image';
import { Navbar, Dropdown } from 'react-bootstrap';



const AdminUserprofile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uppy, setUppy] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  useEffect(() => {
    const Fetchadminprofile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await fetch(`/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Admin Profile Response', response);
        const data = await response.json();
        console.log('Admin Profile data: ', data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setImageUrl(data.imageUrl);


      } catch (error) {
        console.log(error)
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
    fetchNotifications();

    Fetchadminprofile();
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
      console.log('Upload complete:', result);
      if (result.successful && result.successful.length > 0) {
        //console.log("Response body from upload:", result.successful[0].response.body);
        const uploadedImageUrl = result.successful[0].response.body.uploadURL;
        //console.log("Extracted URL:", uploadedImageUrl);
        setImageUrl(uploadedImageUrl);
        saveImageUrlToDB(uploadedImageUrl);

      }
    });

    setUppy(instance);

    return () => {
      instance.close();
    };
    
  }, [imageUrl]);

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

  const handleUpload = () => {
    if (uppy) {
      uppy.upload();
    }
  }

  const signOut = () => {
    // Remove the JWT token
    localStorage.removeItem('token');

    // Redirect to login or another page
    window.location.href = '/';
  }

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
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Navbar expand="lg" style={{ backgroundColor: '#d8456b'}}>
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
                    <Dropdown.Menu style={{ left: 'auto', right: 20 }}>
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
          <div
            className="col-sm" style={{ backgroundColor: '#ffffff', overflow: 'hidden', textAlign: 'center' }}>
            {imageUrl && (
              <Image
                className="profile-picture" style={{ borderRadius: '50%' }} width={200} height={200} priority src={imageUrl} alt="Uploaded Image" />
            )}

            <br />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {selectedFile && <p>{selectedFile.name}</p>}

            <h3 style={{ marginTop: '20px' }}>{name}</h3>
            <p>
              {email} <br />
              {phone}
            </p>
            <button
              style={{
                fontWeight: 'bold',
                width: '100px',
                padding: '5px',
                borderRadius: '5px',
                backgroundColor: '#0b5ed7',
              }} onClick={signOut}
            >
              Signout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminUserprofile;