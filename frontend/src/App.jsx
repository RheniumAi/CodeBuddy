import { Routes, Route } from 'react-router-dom';

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from 'react-hot-toast';

function App() {
	return (
		<div >
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
        		<Route path='/profile' element={<ProfilePage />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
