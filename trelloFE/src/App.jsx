import Board from "./pages/Boards/_id";
import { Routes, Route, Navigate} from 'react-router-dom'
import NotFoundPage from '~/pages/404NotFound/404page';
import Auth from '~/pages/Auth/Auth';
import { AccountVerification } from "../../../IT_Job/IT_Job/src/components/AccountVerification/AccountVerification";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./redux/user/userSlice";
import  Settings  from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards/index'


const ProtectedRoute = ({ user }) => {
  if(!user) return <Navigate to='/login'  replace={true}/>
  return <Outlet />
}

const UnauthorizedRoute = ({ user }) => {
  if(user) return <Navigate to='/'  replace={true}/>
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  
  return (
    <Routes>

      <Route path="/" element={

        <Navigate to="/boards" replace={true}/>

      }/> 
      {/* replace = {true} dùng để cho phép người dùng quay lại URL trươc đó */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        <Route path="/boards/:boardId" element={<Board />}/>
        <Route path="/boards" element={<Boards/>}/>
        <Route path="/settings/account" element={<Settings />}/>
        <Route path="/settings/security" element={<Settings />}/>

      </Route>

      <Route element={<UnauthorizedRoute user={currentUser}/>}>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/account/verification" element={<AccountVerification />} />

      </Route>


      {/* Dùng làm page 404 not found */}
      <Route path="*" element={<NotFoundPage />}/>
    
    </Routes>
  );
}

export default App;
