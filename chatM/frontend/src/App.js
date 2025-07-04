import {Routes, Route} from 'react-router-dom'

import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/signUp';
import ChatM from './pages/ChatM';

function App() {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />}/> 
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/chatm' element={<ChatM/>}/>
    </Routes>
  )
}

export default App;
