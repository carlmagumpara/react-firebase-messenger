import { Routes, Route } from 'react-router-dom';

// Middleware
import Auth from './pages/components/Auth';
import Guest from './pages/components/Guest';

// Pages
import Login from './pages/login';
import Register from './pages/register';
import Conversations from './pages/conversations';
import Profile from './pages/profile';
import Settings from './pages/settings';

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
        <Route path="settings" element={<Auth><Profile /></Auth>} />
        <Route path="profile" element={<Auth><Settings /></Auth>} />
        <Route path="/" element={<Auth><Guest></Guest></Auth>}/>
      </Routes>
    </div>
  );
}

export default App;
