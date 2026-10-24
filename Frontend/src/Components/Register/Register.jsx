import React, { useState } from 'react';
import API from '../services/api'; // ✅ Updated: Using central API instance instead of hardcoded localhost
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/users/Create', {
                name,
                email,
                password
            });
            alert("User created successfully!");
            console.log(response.data);
            setName('');
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Registration failed!");
        }
    };

    const userLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/login', {
                password: userPassword,
                email: userEmail
            });

            alert("Login successfully!");
            setUserPassword('');
            setUserEmail('');

            if (response.data.userId) {
                localStorage.setItem('userId', response.data.userId);
            } else if (response.data.user && response.data.user._id) {
                localStorage.setItem('userId', response.data.user._id);
            }

            if (response.data.role === 'owner') {
                localStorage.setItem('userRole', 'owner');
                navigate('/AdminDashBoard'); 
            } else {
                localStorage.setItem('userRole', 'user');
                navigate('/'); 
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen mt-6 bg-gray-100">
            <div className="flex gap-8 flex-wrap">
                
                <div className="bg-white p-8 rounded shadow-md w-96">
                     <h2 className="text-2xl font-bold text-center mb-4">Please Register First!</h2>
                     <div className="mb-4">
                         <form className="flex flex-col space-y-4" onSubmit={handleRegisterSubmit}>
                             <input 
                                 value={name} 
                                 onChange={(e) => setName(e.target.value)} 
                                 className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                 type="text" 
                                 placeholder="Name" 
                                 required
                             />
                             <input 
                                 value={email} 
                                 onChange={(e) => setEmail(e.target.value)} 
                                 className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                 type="email" 
                                 placeholder="Email" 
                                 required
                             />
                             <input 
                                 value={password} 
                                 onChange={(e) => setPassword(e.target.value)} 
                                 className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                 type="password" 
                                 placeholder="Password" 
                                 required
                             />
                             <input 
                                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                                 type="submit" 
                                 value="Register" 
                             />
                         </form>
                     </div>
                </div>    

                <div className="mb-4 bg-white p-8 rounded shadow-md w-96">
                     <h2 className="text-2xl font-bold text-center mb-4">Please Login!</h2>
                     <div className="mb-4">
                         <form className="flex flex-col space-y-4" onSubmit={userLoginSubmit}>
                             <input 
                                 value={userEmail} 
                                 onChange={(e) => setUserEmail(e.target.value)} 
                                 className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                 type="email" 
                                 placeholder="Email" 
                                 required
                             />
                             <input 
                                 value={userPassword} 
                                 onChange={(e) => setUserPassword(e.target.value)} 
                                 className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                 type="password" 
                                 placeholder="Password" 
                                 required
                             />
                             <input 
                                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                                 type="submit" 
                                 value="Login" 
                             />
                         </form>
                     </div>
                </div>

            </div>    
        </div>
    );
};

export default Register;