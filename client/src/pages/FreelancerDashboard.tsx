import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetFreelancerProposalsQuery } from "@/features/gig/gigAPI";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default function FreelancerDashboard() {
  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  
  const { data: proposals, error, isLoading } = useGetFreelancerProposalsQuery(walletAddress!, {
    skip: !walletAddress,
  });

  if (!Array.isArray(proposals) || proposals.length === 0) {
    return <div>No proposals found</div>;
  }

  console.log("proposals: ", proposals)

  if (isLoading) return <p>Loading proposals...</p>;
  if (error) return <p>Error fetching proposals</p>;

  return (
    <div className="gap_section">
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
            <TableHead>File</TableHead>
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
                {/* {proposal.clientAddress.slice(0, 6)}...{proposal.clientAddress.slice(-4)} */}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <span>
                      {`${proposal.clientAddress.slice(0, 6)}...${proposal.clientAddress.slice(-4)}`}
                    </span>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
    </div>
  );
}
