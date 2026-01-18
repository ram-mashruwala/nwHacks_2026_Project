import { BrowserRouter, Routes, Route } from "react-router-dom";
import OptionsStrategy from "./pages/OptionsStrategy";
import Login from "./pages/Login";
import Tutorial from "./pages/Tutorial";

import "./App.css"
import "./index.css"
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="/options" element={<OptionsStrategy />} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/tutorial" element = {<Tutorial/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
