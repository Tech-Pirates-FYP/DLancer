import express from "express"
import { acceptProposal, addFreelancerAddress, addGig, editGig, getAllGigs, getGigData, getProposals, getUserAuthGigs, submitProposal } from "../controllers/GigController";
import { authTokenVerification } from "../middleware/authMiddleware";

const router = express.Router()

router.get("/:gigId", getGigData);
router.get("/client/:walletAddress", getAllGigs);

router.use(authTokenVerification)

router.post('/addGig', addGig)
router.put("/add-freelancer", addFreelancerAddress);
router.get("/user/:walletAddress", getUserAuthGigs);
router.put("/edit/:gigId", editGig);


// router.post("/:gigId/proposals", upload.single("file"), addProposal);
router.post("/:gigId/proposals",  submitProposal);
router.patch("/:gigId/proposals/:proposalId/accept", acceptProposal);
router.get("/:gigId/proposals", getProposals);


export default router;