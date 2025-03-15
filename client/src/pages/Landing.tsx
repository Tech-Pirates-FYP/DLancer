import CategoryList from "../components/CategoryList"
import FeaturedJobs from "../components/FeaturedJobs"
import TopFreelancers from "../components/TopFreelancers"
import AllGigs from "./AllGigs"

const Landing = () => {
  return (
    <div>
      <CategoryList />
      <AllGigs />
      <FeaturedJobs />
      <TopFreelancers />
    </div>
  )
}

export default Landing
