import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { useGetGigsByWalletQuery } from "../features/gig/gigAPI";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export default function ClientDashboard() {

  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  console.log("walletAddress: ", walletAddress);

  const { data: gigs, error, isLoading } = useGetGigsByWalletQuery(walletAddress!, {
    skip: !walletAddress,
  });

  // console.log("gigs: ", gigs);

  if (isLoading) return <p>Loading gigs...</p>;
  if (error) return <p>Error fetching gigs</p>;


  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price ($)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Freelancer Assigned</TableHead>
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
              <TableCell>{gig.freelancerAddress}</TableCell>
            </TableRow>
            ))
          }
        </TableBody>
        
      </Table>
    </Card>
  );
}
