import logo from './logo.svg';
import './App.css';
import { HomePage } from './components/HomePage/HomePage';
import { LogIn } from './components/LogIn/LogIn';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SignUp } from './components/SignUp/SignUp';
import { PostContext } from './context/PostContext';
import { UserProfile } from './components/UserProfile/UserProfile';

function App() {
	const posts = [];

  return (
		<PostContext.Provider value={{posts}}>
			<div className="App">
				<Routes>
					<Route exact path='/' element={ <HomePage /> }/>
					<Route exact path='/login' element={ <LogIn /> }/>
					<Route exact path='/dashboard' element= {<Dashboard/>} />
					<Route exact path='/signup' element={<SignUp/>}/>
					<Route exact path='/posts' element={<UserProfile/>}/>
				</Routes>
			</div>
		</PostContext.Provider>
	);
}

export default App;
