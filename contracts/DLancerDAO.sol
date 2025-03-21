// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GovernanceToken.sol";

// DAO Contract
contract DLancerDAO {
    struct Dispute {
        address client;
        address freelancer;
        uint256 escrowId;
        uint256 votesForClient;
        uint256 votesForFreelancer;
        bool resolved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;
    GovernanceToken public dlgtToken;
    address public escrowContract;

    event DisputeRaised(uint256 disputeId, address client, address freelancer);
    event VoteCast(uint256 disputeId, address voter, bool supportClient);
    event DisputeResolved(uint256 disputeId, address winner);

    constructor(address _dlgtToken) {
        dlgtToken = GovernanceToken(_dlgtToken);
    }

    function setEscrowContract(address _escrowContract) external {
        require(escrowContract == address(0), "Escrow contract already set");
        escrowContract = _escrowContract;
    }

    function raiseDispute(address freelancer, uint256 escrowId) external {
        disputes[disputeCount] = Dispute(msg.sender, freelancer, escrowId, 0, 0, false);
        emit DisputeRaised(disputeCount, msg.sender, freelancer);
        disputeCount++;
    }

    function voteOnDispute(uint256 disputeId, bool supportClient) external {
        require(!disputes[disputeId].resolved, "Dispute already resolved");
        require(dlgtToken.balanceOf(msg.sender) > 0, "Must hold DLGT to vote");
        
        if (supportClient) {
            disputes[disputeId].votesForClient++;
        } else {
            disputes[disputeId].votesForFreelancer++;
        }

        emit VoteCast(disputeId, msg.sender, supportClient);
    }

    function resolveDispute(uint256 disputeId) external {
        Dispute storage dispute = disputes[disputeId];
        require(!dispute.resolved, "Already resolved");

        address winner = dispute.votesForClient > dispute.votesForFreelancer ? dispute.client : dispute.freelancer;
        dispute.resolved = true;
        dlgtToken.mint(winner, 100 * 10 ** dlgtToken.decimals());

        emit DisputeResolved(disputeId, winner);
    }
}