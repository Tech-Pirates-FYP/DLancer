import { useGetAllGigsQuery } from "@/features/gig/gigAPI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AllGigs() {
  const { data: gigs, error, isLoading } = useGetAllGigsQuery();
  const navigate = useNavigate();

  const visibleGigs = 6;    
  // console.log("Gigs: ", gigs?.length);

  if (isLoading) return <p>Loading gigs...</p>;
  if (error) return <p>Error fetching gigs</p>;

  const showMoreGigCards = () => {
    navigate('/allgigs');
  }

  return (
    <div className="gap_section max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Featured Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs?.slice(0, visibleGigs).map((gig) => (
          <Card key={(gig as any)._id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{gig.title}</h2>
            <p className="text-sm text-gray-600">{gig.category}</p>
            <p className="text-sm text-gray-700">${gig.price}</p>
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={() => navigate(`/gig/${(gig as any)._id}`)}
            >
              View Details
            </Button>
          </Card>
        ))}

        {
          gigs && gigs.length > visibleGigs && (
            <button onClick={showMoreGigCards}>
              Show more
            </button>
          )
        }
      </div>
    </div>
  );
}
