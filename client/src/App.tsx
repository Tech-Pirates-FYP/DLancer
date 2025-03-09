import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import FreelancerProfile from "./pages/FreelancerProfile";
import CreateGig from "./pages/CreateGig";
import Landing from "./pages/Landing";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/profile" element={<FreelancerProfile />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
      </Routes>
      
    </div>
  );
}

export default App;
