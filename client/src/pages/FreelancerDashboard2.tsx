import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../features/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEditGigMutation, useGetFreelancerProposalsQuery, useGetGigByIdQuery } from "@/features/gig/gigAPI";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useBalanceOfQuery, useSubmitWorkMutation } from "@/features/blockchain/blockApi";
import { toast } from "react-toastify";

export default function FreelancerDashboard2() {  
  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  const dispatch = useDispatch();

  const [submissionLink, setSubmissionLink] = useState<{ [key: string]: string }>({});
  const [ gigid, setGigid ] = useState("");
  const [clicked, setClicked] = useState(false);
  const [balance, setBalance] = useState(0);
  
  const { data: proposals, error, isLoading } = useGetFreelancerProposalsQuery(walletAddress!, { skip: !walletAddress });
  const [ submitWork ] = useSubmitWorkMutation();
  const [editGig] = useEditGigMutation();
  const { data: gigData } = useGetGigByIdQuery(gigid!, {skip: !gigid,});
  const {data: balanceOf} = useBalanceOfQuery(walletAddress!, {skip: !walletAddress,});
  
  if (!Array.isArray(proposals) || proposals.length === 0) {
    return <div>No proposals found</div>;
  }

  console.log("proposals: ", proposals);

  const handleSubmissionChange = (gigId: string, value: string) => {
    setSubmissionLink((prev) => ({
      ...prev,
      [gigId]: value,
    }));
  };
  
  console.log("gigData: ", gigData);

  const handleSubmitButton = async (gigId: string) => {
    setGigid(gigId);
    const link = submissionLink[gigId]; 
    if (!link?.trim()) { 
      toast.error("Please enter a submission link before submitting.");
      return;
    }
    console.log("gigid: ", gigid);
    console.log("gigId: ", gigId);
    
    try {
      if (!gigData?.escrowAddress) {
        toast.error("Escrow address is missing. Please try again later.");
        return;
      }
      await submitWork({ escrowAddress: gigData.escrowAddress, submissionLink: link }).unwrap();
      await editGig({ gigId, updates: { submissionLink: link, status: "submitted" } }).unwrap();
      toast.success("Submission link submitted successfully!");
    } catch (error) {
      console.error("Error submitting the link:", error);
      toast.error("Failed to submit the link. Please try again.");
    }
  };


  const handleClick = () => {
    const balance = Number(balanceOf ?? 0) / 10 ** 18;
    setBalance(balance);
    setClicked(true);
  };
  

  if (isLoading) return <p>Loading proposals...</p>;
  if (error) return <p>Error fetching proposals</p>;

  return (
    <div className="gap_section">
      <button 
        onClick={handleClick} 
        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium text-lg px-10 py-3 rounded-md"
      >
        {clicked ? `Token Balance : ${balance}` : 'Get Token Balance'}
      </button>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Freelancer Dashboard</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client Address</TableHead>
              <TableHead>Proposal File</TableHead>
              <TableHead>Submission Link</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {proposals?.map((proposal) => (
              <TableRow key={proposal.proposalId}>
                <TableCell>{proposal.gigTitle}</TableCell>
                <TableCell>{proposal.gigCategory}</TableCell>
                <TableCell>{proposal.gigPrice}</TableCell>
                <TableCell>
                  <Badge
                    variant={proposal.status === "pending" ? "secondary" : proposal.status === "rejected" ? "destructive" : "default"}
                    className={proposal.status === "accepted" ? "bg-green-500 text-white" : ""}
                  >
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{`${proposal.clientAddress.slice(0, 6)}...${proposal.clientAddress.slice(-4)}`}</span>
                      </TooltipTrigger>
                      {proposal.clientAddress && (
                        <TooltipContent>
                          <p>{proposal.clientAddress}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <a href={proposal.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View File
                  </a>
                </TableCell>

                {proposal.status === "accepted" &&(
                  <>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="Enter the Submission link"
                        value={submissionLink[proposal.gigId] || ""}
                        onChange={(e) => handleSubmissionChange(proposal.gigId, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleSubmitButton(proposal.gigId)}>Submit</Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
