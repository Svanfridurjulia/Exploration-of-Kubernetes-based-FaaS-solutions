import logo from './logo.svg';
import './App.css';
import { HomePage } from './components/HomePage/HomePage';
import { LogIn } from './components/LogIn/LogIn';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SignUp } from './components/SignUp/SignUp';

function App() {
  return (
		<div className="App">
				<Routes>
					<Route exact path='/' element={ <HomePage /> }/>
					<Route exact path='/login' element={ <LogIn /> }/>
					<Route exact path='/dashboard' element= {<Dashboard/>} />
					<Route exact path='/signup' element={<SignUp/>}/>
				</Routes>
		</div>
	);
}

export default App;
