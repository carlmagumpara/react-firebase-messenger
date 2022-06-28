import { Routes, Route } from 'react-router-dom';

// Middleware
import Auth from './pages/components/Auth';
import Guest from './pages/components/Guest';

// Pages
import Login from './pages/login';
import Register from './pages/register';
import Conversations from './pages/conversations';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Guest><Login /></Guest>}/>
        <Route path="register" element={<Guest><Register /></Guest>} />
        <Route path="conversations">
          <Route path=":conversation_id" element={<Auth><Conversations /></Auth>} />
          <Route path="" element={<Auth><Conversations /></Auth>} />
        </Route>
        <Route path="/" element={<Auth><Guest></Guest></Auth>}/>
      </Routes>
    </div>
  );
}

export default App;
