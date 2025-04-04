import { Menu, Search, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useConnectWalletMutation } from '../features/auth/authAPI';
import { setWalletAddress } from '../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Navbar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [connectWallet, {data: walletAddress, error}] = useConnectWalletMutation();

  const switchToClient =  () => {
    navigate('/client-dashboard');
  }

  const navigateToHome = () => {
    navigate('/');
  }


  const handleConnect = async () => {
    const response = await connectWallet().unwrap();
    if (response) {
      dispatch(setWalletAddress(response));
    }
  };

  const switchToFreelancerDashboard = () => {
    navigate('/freelancer-dashboard');
  }

  // useEffect(() => {
  //   connectWallet();
  // }, []);
  
  return (
    <nav className=" top-0 left-0 w-full z-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-2xl font-bold text-indigo-600 ml-2 cursor-pointer" onClick={navigateToHome}>DLancer</div>
          </div>
          
          <div className="hidden lg:flex flex-1 items-center justify-center px-8">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for projects..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {
               (
                <button onClick={switchToClient}>
                  Client Dashboard
                </button>
              ) 
            }

            <button onClick={switchToFreelancerDashboard}>
              Freelancer Dashboard
            </button>
            


            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleConnect} >
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect"}
                  </button>
                </TooltipTrigger>
                {walletAddress && (
                  <TooltipContent>
                    <p>{walletAddress}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}