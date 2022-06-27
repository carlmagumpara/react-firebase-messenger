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
        <Route path="/login" element={<Guest><Login /></Guest>}/>
        <Route path="/register" element={<Guest><Register /></Guest>} />
        <Route path="/conversations" element={<Auth><Conversations /></Auth>} />
        <Route path="/" element={<Auth></Auth>}/>
      </Routes>
    </div>
  );
}

export default App;
