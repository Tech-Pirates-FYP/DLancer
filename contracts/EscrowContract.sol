// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './DLancerDAO.sol';
import './GovernanceToken.sol';
import './mockUSDC.sol';

contract EscrowContract {
    struct Escrow {
        address client;
        address freelancer;
        uint256 amount;
        uint submissionDeadline;
        string file;
        bytes32 fileHash;
    }

    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, WORK_SUBMITTED, COMPLETE, REFUNDED }
    State public currentState;

    IERC20 public usdc;
    DLancerDAO public dao;
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;
    

    event EscrowCreated(uint256 escrowId, address client, address freelancer, uint256 amount, uint submissionDeadline);
    event WorkSubmitted(uint256 escrowId, string fileUrl);
    event PaymentReleased(uint256 escrowId, address freelancer);
    event DisputeRaised(uint256 escrowId);


    constructor(address _dao, address _mockUSDC) {
        usdc = IERC20(_mockUSDC);
        dao = DLancerDAO(_dao);
        currentState = State.AWAITING_PAYMENT;
    }
    // usdc = IERC20(0x5dEaC602762362FE5f135FA5904351916053cF70);

    modifier onlyClient(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].client, "Only client can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier escrowExists(uint256 escrowId) {
        require(escrowId < escrowCount, "Escrow does not exist");
        _;
    }

    modifier inState(State _state) {
        require(currentState == _state, "Invalid state.");
        _;
    }

    function createEscrow(address freelancer, uint256 amount, uint _submissionPeriodInDays) external inState(State.AWAITING_PAYMENT) {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        uint submissionDeadline = block.timestamp + (_submissionPeriodInDays * 1 days);
        escrows[escrowCount] = Escrow(msg.sender, freelancer, amount, submissionDeadline, "", "");
        currentState = State.AWAITING_DELIVERY;
        emit EscrowCreated(escrowCount, msg.sender, freelancer, amount, submissionDeadline);
        escrowCount++;
    }

    function submitWork(uint256 escrowId, string memory _fileUrl) external onlyFreelancer(escrowId) escrowExists(escrowId) inState(State.AWAITING_DELIVERY) {
        Escrow storage escrow = escrows[escrowId];
        require(block.timestamp <= escrow.submissionDeadline, "Submission deadline passed.");
        escrow.file = _fileUrl;
        escrow.fileHash = sha256(abi.encodePacked(_fileUrl));
        currentState = State.WORK_SUBMITTED;
        emit WorkSubmitted(escrowId, _fileUrl);
    }

    function releasePayment(uint256 escrowId) external onlyClient(escrowId) escrowExists(escrowId) inState(State.WORK_SUBMITTED) {
        Escrow storage escrow = escrows[escrowId];
        currentState = State.COMPLETE;
        usdc.transfer(escrow.freelancer, escrow.amount);
        emit PaymentReleased(escrowId, escrow.freelancer);
    }

    function raiseDispute(uint256 escrowId) external onlyClient(escrowId) escrowExists(escrowId) {
        dao.raiseDispute(escrows[escrowId].freelancer, escrowId);
        emit DisputeRaised(escrowId);
    }

    function getFileDetails(uint256 escrowId) external view returns (string memory, bytes32) {
        Escrow storage escrow = escrows[escrowId];
        return (escrow.file, escrow.fileHash);
    }

    function balance(address account) external view returns (uint256) {
        return usdc.balanceOf(account);
    }

}
