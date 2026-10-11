import React from 'react'

const RegisterAdmin = () => {
  return (
    <div className="flex items-center justify-center h-screen mt-6 bg-gray-100">
        <div className="flex gap-8 flex-wrap">
            <div className="bg-white p-8 rounded shadow-md w-96">
                 <h2 className="text-2xl font-bold text-center mb-4">Please Register First!</h2>
                    <div className="mb-4">
                        <form className="flex flex-col space-y-4">
                            <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Name" />
                            <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="Email" />
                            <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" />
                            <input className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit" value="Register" />
                        </form>
                    </div>
            </div>    
            <div className="mb-4 bg-white p-8 rounded shadow-md w-96">
                 <h2 className="text-xl font-bold text-center mb-4">Please Login!</h2>
                    <div className="mb-4">
                        <form className="flex flex-col space-y-4">
                            <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="Email" />
                            <input className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" />
                            <input className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit" value="Login" />
                        </form>
                    </div>
            </div>
        </div>    
    </div>

  )
}

export default RegisterAdmin
