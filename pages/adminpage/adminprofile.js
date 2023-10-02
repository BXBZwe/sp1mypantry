import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Image from 'next/image';


const AdminUserprofile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uppy, setUppy] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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



  return (
    <>

      <div className="container-fluid">
        <div className="row">
          <nav
            style={{ backgroundColor: '#d8456b' }}
            className="navbar navbar-expand-lg navbar-dark"
          >
            <div className="container">
              <a className="navbar-brand custom-cursive-font" href="adminhome">
                <h3>MyPantry - Admin</h3>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <span className="navbar-nav mx-auto"></span>
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      style={{ color: 'white' }}
                      aria-current="page"
                      href="adminhome"
                    >
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      aria-current="page"
                      href="adminprofile"
                      style={{ fontWeight: 'bold', color: 'white' }}
                    >
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div
            className="col-sm"
            style={{
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {imageUrl && (
              <Image
                className="profile-picture" style={{ borderRadius: '50%' }} width = {200} height={200} priority src={imageUrl} alt="Uploaded Image"/>
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