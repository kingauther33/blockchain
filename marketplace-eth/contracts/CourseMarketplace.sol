// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC20.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract CourseMarketplace is ERC20 {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint256 id; // 32
        uint256 price; // 32
        bytes32 proof; // 32
        address owner; // 20
        State state; // 1
    }

    bool public isStopped = false;

    uint256 private rateEthToMyr = 70000;

    // mapping of courseHash to Course data
    mapping(bytes32 => Course) private ownedCourses;

    // mapping of courseID to courseHash
    mapping(uint256 => bytes32) private ownedCourseHash;

    // number of all courses + id of the course
    uint256 private totalOwnedCourses;

    address payable private owner;

    constructor() ERC20("Myrmica Token", "MYR") {
        setContractOwner(msg.sender);
        _mint(msg.sender, 10000000 * 10**18);
        _mint(address(this), 100000000 * 10**18);
    }

    /// Course is not created!
    error CourseIsNotCreated();

    /// Course has invalid state
    error InvalidState();

    /// Course has already a Owner!
    error CourseHasOwner();

    /// Sender is not course owner!
    error SenderIsNotCourseOwner();

    /// Only owner has an access!
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    modifier onlyWhenNotStopped() {
        require(!isStopped);
        _;
    }

    modifier onlyWhenStopped() {
        require(isStopped);
        _;
    }

    receive() external payable {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function deposit() external payable onlyWhenNotStopped {
        CourseMarketplace courseMarketPlace = CourseMarketplace(
            payable(address(this))
        );
        uint256 valueInMyrmica = msg.value * rateEthToMyr;
        courseMarketPlace.approve(msg.sender, valueInMyrmica);
        transferFrom(payable(address(this)), msg.sender, valueInMyrmica);
    }

    function getRateEthToMyr() external view returns (uint256) {
        return rateEthToMyr;
    }

    function withdraw(uint256 amount) external onlyOwner {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed!");
    }

    function emergencyWithdraw() external onlyWhenStopped onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed!");
    }

    function selfDestruct() external onlyWhenStopped onlyOwner {
        selfdestruct(owner);
    }

    function stopContract() external onlyOwner {
        isStopped = true;
    }

    function resumeContract() external onlyOwner {
        isStopped = false;
    }

    function purchaseCourse(
        bytes16 courseId, // 0x00000000000000000000000000003130
        // 0x31343130343734000000000000000000
        // 0x7365c778f2cd9ebbc8bf9cc954bf7486b70f35ba3d0f2124859dd86b5ec7b997
        // 5495000000000000
        bytes32 proof // 0x0000000000000000000000000000313000000000000000000000000000003130
    ) external payable onlyWhenNotStopped {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }

        uint256 id = totalOwnedCourses++;

        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function repurchaseCourse(bytes32 courseHash)
        external
        payable
        onlyWhenNotStopped
    {
        if (!isCourseCreated(courseHash)) {
            revert CourseIsNotCreated();
        }

        if (!hasCourseOwnership(courseHash)) {
            revert SenderIsNotCourseOwner();
        }

        Course storage course = ownedCourses[courseHash];

        if (course.state != State.Deactivated) {
            revert InvalidState();
        }

        course.state = State.Purchased;
        course.price = msg.value;
    }

    function activateCourse(bytes32 courseHash)
        external
        onlyWhenNotStopped
        onlyOwner
    {
        if (!isCourseCreated(courseHash)) {
            revert CourseIsNotCreated();
        }

        Course storage course = ownedCourses[courseHash];

        if (course.state != State.Purchased) {
            revert InvalidState();
        }

        course.state = State.Activated;
    }

    function deactivateCourse(bytes32 courseHash)
        external
        onlyWhenNotStopped
        onlyOwner
    {
        if (!isCourseCreated(courseHash)) {
            revert CourseIsNotCreated();
        }

        Course storage course = ownedCourses[courseHash];

        if (course.state != State.Purchased) {
            revert InvalidState();
        }

        (bool success, ) = course.owner.call{value: course.price}("");
        require(success, "Transfer failed!");

        course.state = State.Deactivated;
        course.price = 0;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns (uint256) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint256 index)
        external
        view
        returns (bytes32)
    {
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash)
        external
        view
        returns (Course memory)
    {
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function isCourseCreated(bytes32 courseHash) private view returns (bool) {
        return
            ownedCourses[courseHash].owner !=
            0x0000000000000000000000000000000000000000;
    }

    function hasCourseOwnership(bytes32 courseHash)
        private
        view
        returns (bool)
    {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}
