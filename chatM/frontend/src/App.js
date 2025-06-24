import {Routes, Route} from 'react-router-dom'

import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/signUp';

function App() {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />}/> 
      <Route path='/signup' element={<SignUp/>}/>
      {/* <Route path='/chatm' element/> */}
    </Routes>
  )
}

export default App;
