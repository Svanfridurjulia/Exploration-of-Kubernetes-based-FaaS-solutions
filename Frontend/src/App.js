import { Routes, Route,Router, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const App = () => {
	return (
		<div className="App">
			<Container>
				<Routes>
					<Route exact path='/' element={ <HomePage /> }/>
					<Route exact path='/login' element={ <Bubbles /> }/>
					
					<Route path='*' element={<NotFound />} />
				</Routes>
			</Container>
		</div>
	);
}
// <Route path="*" component={ NotFound } />
// <Footer />
export default App;


/*
<Route exact path='/orders' element={<Orders/>}/>
*/
