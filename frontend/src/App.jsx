import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/landing/homepage';
import SignUpPage from "./pages/auth/signup/signuppage";
import LoginPage from "./pages/auth/login/loginpage";
import ProfilePage from "./pages/profile/profilepage";

import { Toaster } from 'react-hot-toast';
import CollaboratePage from './pages/collaborate/collaboratepage';

import Aboutdev from './pages/about/about';
import Features from './pages/Features/features';

function App() {
	return (
		<div >
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/about' element={<Aboutdev/>}></Route>
				<Route path='features' element={<Features/>}></Route>
        		<Route path='/profile' element={<ProfilePage />} />
				<Route path='/collaborate' element={<CollaboratePage />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
