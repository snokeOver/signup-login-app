import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import FooterPart from "./components/FooterPart";
import ForgetPassword from "./pages/ForgetPasword";
import AuthenticPages from "./components/AuthenticPages";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route element={<AuthenticPages />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterPart />
    </BrowserRouter>
  );
}

export default App;
