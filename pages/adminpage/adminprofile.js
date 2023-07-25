import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

const adminUserprofile = () => {
    const [name, setName]= useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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

            } catch (error){
                console.log(error)
            }
        };
        Fetchadminprofile();
    }, []);
    
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
                <h3 style={{ marginTop: '20px' }}>{name}</h3>
                <p>{email}</p>
                <p>{phone}</p>
                <div style={{ marginTop: '50px', marginBottom: '100%', backgroundColor: 'white' }}></div>
            </div>

        </>
    );
};
export default adminUserprofile;