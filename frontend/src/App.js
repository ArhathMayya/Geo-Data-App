import logo from './logo.svg';
import './App.css';
import MapLayout from './components/Maplayout';
import Login from './components/LoginComponent';
import Signup from './components/SignupComponent';
import { useSelector } from 'react-redux';

function App() {
  // Redux state for login and login page status
  const { login } = useSelector((state) => state.menu);
  const { loginpage } = useSelector((state) => state.menu);

  return (
    <>
      {/* Conditional rendering based on login and login page status */}
      {login || sessionStorage.getItem("Login") == "true" ? (
        <MapLayout />
      ) : (
        loginpage ? (
          <Login />
        ) : (
          <Signup />
        )
      )}
    </>
  );
}

export default App;
