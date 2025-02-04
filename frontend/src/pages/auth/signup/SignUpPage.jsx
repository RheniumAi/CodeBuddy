import React from 'react';
function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>

        <label className="flex flex-col gap-1 mb-4">
          <span className="font-medium text-gray-700">Username</span>
          <input
            type="text"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="BugHunter"
          />
        </label>

        <label className="flex flex-col gap-1 mb-4">
          <span className="font-medium text-gray-700">Email</span>
          <input
            type="email"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="hunter@site.com"
          />
        </label>

        <label className="flex flex-col gap-1 mb-6">
          <span className="font-medium text-gray-700">Password</span>
          <input
            type="password"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="••••••••"
          />
        </label>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 hover:shadow-xl transition duration-300"
        >
          Submit
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline hover:text-blue-700 transition duration-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
