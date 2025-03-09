import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/landingpg/HomePage';
import SignUpPage from "./pages/auth/signuppg/SignUpPage";
import LoginPage from "./pages/auth/loginpg/LoginPage";
import ProfilePage from "./pages/profilepg/ProfilePage";

import { Toaster } from 'react-hot-toast';
import CollaboratePage from './pages/collaboratepg/CollaboratePage';

import Aboutdev from './pages/about/Aboutdev';
import Features from './pages/featurespg/Features';

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
