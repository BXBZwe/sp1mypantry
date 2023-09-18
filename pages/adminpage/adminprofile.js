import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';

const AdminUserprofile = () => {
    const [name, setName]= useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [uppy, setUppy] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); 
    useEffect(() => {
        const Fetchadminprofile = async () => {
            try{
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                const response = await fetch (`/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Admin Profile Response', response);
                const data = await response.json();
                console.log ('Admin Profile data: ', data);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setImageUrl(data.imageUrl);


            } catch (error){
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

    
    return (
        <>
        
            <nav style={{ padding: '30px', height: '50px', width: '100%', backgroundColor: '#47974F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ color: 'white', fontFamily: 'cursive' }}>MyPantry</h2>
                <div style={{ marginRight: '10px' }}>
                    <Link href="/adminpage/adminhome" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }} passHref>
                        Home
                    </Link>
                    <Link href="/adminpage/adminprofile" style={{ margin: '0 10px', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                     Profile
                    </Link>
                </div>
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>{selectedFile && <p>{selectedFile.name}</p>}
                {imageUrl && <img className="profile-picture" style ={{ width: '100px', height: '100px',borderRadius: '50%',objectFit: 'cover',overflow: 'hidden'}}
                src={imageUrl} alt="Uploaded Image" />}
                <h3 style={{ marginTop: '20px' }}>{name}</h3>
                <p>{email}</p>
                <p>{phone}</p>
                <div style={{ marginTop: '50px', marginBottom: '100%', backgroundColor: 'white' }}></div>
            </div>

        </>
    );
};
export default AdminUserprofile;