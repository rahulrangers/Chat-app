import { Route,Routes,BrowserRouter } from "react-router-dom"
import Login from "./Components/Login"
import Chat from "./Components/Chat"
import { RecoilRoot } from "recoil"
import Signup from "./Components/Signup"
import Home from "./Components/Home"
const App=()=>{
  return(
    <>

<RecoilRoot>

<BrowserRouter>
<Routes>
  <Route path="/signup" element={<Signup/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/chat/:id" element={<Chat/>}/>
  <Route path="/" element={<Home/>}/>
</Routes>
</BrowserRouter>
</RecoilRoot>

  </>
  )
}
export default App