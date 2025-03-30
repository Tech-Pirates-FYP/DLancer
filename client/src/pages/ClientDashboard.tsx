import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { useAcceptProposalMutation, useEditGigMutation, useGetGigsByWalletQuery } from "../features/gig/gigAPI";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useBalanceOfQuery, useCreateEscrowMutation, useFundEscrowMutation, useGetAllEscrowsQuery, useGetEscrowStateQuery, useLoadMockUSDCContractQuery, useMintTokenMutation, useReleasePaymentMutation } from "@/features/blockchain/blockApi";
import { useDispatch } from "react-redux";
import { setEscrowContractAddress } from "@/features/gig/gigSlice";

export default function ClientDashboard() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [clicked, setClicked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [ tokens, setTokens ] = useState(0);
  const [escrowAddress, setEscrowAddress] = useState("");
  const [ amount, setAmount ] = useState(0);
  const [fundedEscrows, setFundedEscrows] = useState<{ [key: string]: boolean }>({});
  const [releasedPayment, setReleasedPayment] = useState<{ [key: string]: boolean }>({});

  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  // console.log("walletAddress: ", walletAddress);

  const { data: gigs, isLoading } = useGetGigsByWalletQuery(walletAddress!, {skip: !walletAddress,});
  const [ createEscrow ] = useCreateEscrowMutation();
  const [ mintToken ] = useMintTokenMutation();
  const { data: escrows } = useGetAllEscrowsQuery();
  const [ acceptProposal ] = useAcceptProposalMutation();
  const {data: balanceOf} = useBalanceOfQuery(walletAddress!, {skip: !walletAddress,});
  const [ fundEscrow ] = useFundEscrowMutation();
  const [ editGig ] = useEditGigMutation();
  const [ releasePayment ] = useReleasePaymentMutation();
  // const { data: state } = useGetEscrowStateQuery(escrowAddress, {skip: !escrowAddress});

  const navigateToCreateGig = () => {
    navigate('/create-gig');
  }

  const onAcceptClick = async (gigId: string, proposalId: string) => {
    try {
      await acceptProposal({ gigId, proposalId }).unwrap();
      toast.success("Successfully Accepted the proposal", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(`Accepted proposal ${proposalId} for gig ${gigId}`);
    } catch (error) {
      console.error("Error accepting proposal:", error);
    }
  };
  
  const handleCreateEscrow = async (freelancer: string, amount: number, days: number, gigId: string) => {
    try {
      const response = await createEscrow({ freelancer, amount, days }).unwrap();
      console.log("Escrow created successfully:", response);
      setEscrowAddress(response);
      dispatch(setEscrowContractAddress(response));
      const res = await editGig({ gigId, updates: { escrowAddress: response } }).unwrap();
      console.log("edited gig: ", res);
      alert("Escrow created successfully!");
    } catch (err: any) {
      console.error("Error creating escrow:", err);
      alert("Error creating escrow: " + (err.data || err.message));
    }
  }

  const handleMint = async (e: any) => {
    e.preventDefault();
    try {
      if (!walletAddress) {
        console.error("Wallet address is null");
        return;
      }
      console.log("tokens: ", tokens);
      const response = await mintToken({ to: walletAddress, amount: tokens }).unwrap();
      console.log("Token minted successfully:", response);
    } 
    catch (error) {
      console.error("Error minting token:", error);
    }
  }

  const handleClick = () => {
    const balance = Number(balanceOf ?? 0) / 10 ** 18;
    setBalance(balance);
    setClicked(true);
  };

  const handleFundEscrow = async (gig: any) => {
    const escrowAddress = gig.escrowAddress;
    const amount = gig.price * 10 ** 18;
    try {
      await fundEscrow({ escrowAddress, amount }).unwrap();
      await editGig({ gigId: gig._id, updates: { status: "funded" } }).unwrap();
      console.log("Funding escrow with address: ", escrowAddress);
  
      setFundedEscrows((prev) => ({
        ...prev,
        [escrowAddress]: true,
      }));
    } catch (error) {
      console.error("Error funding escrow:", error);
    }
  };

  const handleReleasePayment = async ({escrowAddress, gigId}: { escrowAddress: string; gigId: string }) => {
    try {
      await releasePayment( escrowAddress );
      console.log("Payment released");

      setReleasedPayment((prev) => ({
        ...prev,
        [escrowAddress]: true,
      }))

      toast.success("Payment released successfully");

      await editGig({ gigId, updates: { status: "completed" } }).unwrap();

    } catch (error: any) {
      console.log("Error releasing payment: ", error);      
    }
  }


  if (isLoading) return <p>Loading gigs...</p>;

  return (
    <div className="gap_section">

      <div className="w-[30%]">
        <span className="text-lg">Please mint token before creating gig</span>
        <div className="flex flex-col gap-2">
          <input onChange={(e) => setTokens(Number(e.target.value))} className="border border-2xl p-2 border-black bg-white text-black" type="number" value={tokens} id="mintAmount" placeholder="Amount" />
          <button
            onClick={handleMint}
            className="border text-lg font-semibold px-5 py-3   border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
          >
            Mint Tokens
          </button>
          <button 
            onClick={handleClick} 
            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium text-lg px-10 py-3 rounded-md"
          >
            {clicked ? `Token Balance : ${balance}` : 'Get Token Balance'}
          </button>
        </div>
        <br />
      </div>

    <Card className="p-6">
      <ToastContainer aria-label={undefined} />

      <div className="w-full flex relative justify-between">
        <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
        <button className="absolute top-0 right-0" onClick={navigateToCreateGig}>
          Create Gig
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price ($)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Freelancer Assigned</TableHead>
            <TableHead>View File</TableHead>
            <TableHead>Proposals</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            gigs?.map((gig) => (
            <TableRow key={(gig as any)._id}>
              <TableCell>{gig.title}</TableCell>
              <TableCell>{gig.category}</TableCell>
              <TableCell>{gig.price}</TableCell>
              <TableCell>
              <Badge variant={gig.status === "completed" ? "default" : gig.status === "pending" ? "secondary" : "destructive"}>
                {gig.status}
              </Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {
                        gig.freelancerAddress ? (
                          <span>
                            {`${gig.freelancerAddress?.slice(0, 6)}...${gig.freelancerAddress?.slice(-4)}`}
                          </span>
                        ) : ("")
                      }
                    </TooltipTrigger>
                    {gig.freelancerAddress && (
                      <TooltipContent>
                        <p>{gig.freelancerAddress}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>
                {gig.proposals?.map((prop, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <a href={prop.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View File
                    </a>
                  </div>
                ))}
              </TableCell>

              <TableCell>
                {gig.proposals?.map((prop, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                        <span>
                          {`${prop.freelancerAddress?.slice(0, 6)}...${prop.freelancerAddress?.slice(-4)}`}
                        </span>
                        </TooltipTrigger>
                        {prop.freelancerAddress && (
                          <TooltipContent>
                            <p>{prop.freelancerAddress}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {prop.status !== "accepted" && gig.status === 'pending' && (
                      <Button className="ml-2" onClick={() => onAcceptClick(gig._id, prop._id)}>
                        Accept
                      </Button>
                    )}

                    {prop.status === "accepted" && !gig.escrowAddress && (
                      <Button 
                        className="ml-2" 
                        onClick={() => handleCreateEscrow(gig.freelancerAddress ?? "", gig.price, gig.deliveryTime, gig._id)}
                      >
                        Create Contract
                      </Button>
                    )}

                    {prop.status === "accepted" && gig.status !== "funded" && gig.escrowAddress && (
                      <Button 
                        className="ml-2" 
                        onClick={() => handleFundEscrow(gig)}
                      >
                        Fund Contract
                      </Button>
                    )}

                    {prop.status === "accepted" && gig.status==="funded" && gig.escrowAddress && gig.submissionLink  && (
                      <Button 
                        className="ml-2" 
                        onClick={() => handleReleasePayment({ escrowAddress: gig.escrowAddress!, gigId: gig._id })}
                      >
                        Release Payment
                      </Button>
                    )}

                  </div>
                ))}
              </TableCell>


              <TableCell>
              {
                gig.submissionLink && (
                  <div className="flex items-center justify-between mb-2">
                    <a href={gig.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Show Submission Link
                    </a>
                  </div>
                )
              }
              </TableCell>

              
              
            </TableRow>
            ))
          }
        </TableBody>
        
      </Table>
    </Card>
    </div>
  );
}
