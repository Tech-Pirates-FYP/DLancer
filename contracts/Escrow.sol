// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, WORK_SUBMITTED, COMPLETE, REFUNDED }
    
    address public client;
    address public freelancer;
    uint256 public amount;
    uint public submissionDeadline;
    State public state;
    IERC20 public usdc;
    string public file;
    bytes32 public fileHash;

    event WorkSubmitted(string fileUrl);
    event PaymentReleased();
    event DisputeRaised();
    event EscrowFunded(uint256 amount);

    constructor(address _client, address _freelancer, uint256 _amount, uint _submissionPeriodInDays, address _usdc) {
        client = _client;
        freelancer = _freelancer;
        amount = _amount;
        submissionDeadline = block.timestamp + (_submissionPeriodInDays * 1 days);
        state = State.AWAITING_PAYMENT;
        usdc = IERC20(_usdc);
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client can perform this action");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }

    function fundEscrow() external onlyClient inState(State.AWAITING_PAYMENT) {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        state = State.AWAITING_DELIVERY;
        emit EscrowFunded(amount);
    }

    function submitWork(string memory _fileUrl) external onlyFreelancer inState(State.AWAITING_DELIVERY) {
        require(block.timestamp <= submissionDeadline, "Submission deadline passed.");
        file = _fileUrl;
        fileHash = sha256(abi.encodePacked(_fileUrl));
        state = State.WORK_SUBMITTED;
        emit WorkSubmitted(_fileUrl);
    }

    function releasePayment() external onlyClient inState(State.WORK_SUBMITTED) {
        usdc.transfer(freelancer, amount);
        state = State.COMPLETE;
        emit PaymentReleased();
    }

    function raiseDispute() external onlyClient {
        // state = State.REFUNDED;
        emit DisputeRaised();
    }

    function getEscrowState() external view returns (string memory) {
        if (state == State.AWAITING_PAYMENT) return "AWAITING_PAYMENT";
        if (state == State.AWAITING_DELIVERY) return "AWAITING_DELIVERY";
        if (state == State.WORK_SUBMITTED) return "WORK_SUBMITTED";
        if (state == State.COMPLETE) return "COMPLETE";
        if (state == State.REFUNDED) return "REFUNDED";
        return "UNKNOWN";
    }

}
