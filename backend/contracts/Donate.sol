// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Donate is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _donationIds;

    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Donation) public donations;

    event NewDonation(
        address sender,
        uint256 newDonationId,
        uint256 amount,
        uint256 timestamp
    );

    uint256 private _price = 50000000000000;
    string public baseURI;

    constructor() ERC721("RoDec", "RDC") {}

    function donate() external payable {
        require(msg.value >= _price, "Amount needs to be superior to 0.00005");

        uint256 newDonationId = _donationIds.current();
        _safeMint(msg.sender, newDonationId);
        donations[newDonationId] = Donation({
            amount: msg.value,
            timestamp: block.timestamp
        });
        _donationIds.increment();
        emit NewDonation(msg.sender, newDonationId, msg.value, block.timestamp);
    }

    function setBaseURI(string memory _URI) external onlyOwner {
        baseURI = _URI;
    }

    function _baseURI() internal view override(ERC721) returns (string memory) {
        return baseURI;
    }

    function setPrice(uint _newPrice) external onlyOwner {
        price = _newPrice;
    }

    function getPrice() public view returns (uint256) {
        return _price;
    }

    function nbDonationsTotal() external view returns (uint256) {
        return _donationIds.current();
    }

    function getDonationDetails(
        uint256 donationId
    ) public view returns (uint256, uint256) {
        require(
            donations[donationId].timestamp != 0,
            "Donation does not exist"
        );
        Donation memory donation = donations[donationId];
        return (donation.amount, donation.timestamp);
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 donationCount = balanceOf(_owner);
        uint256[] memory donationsId = new uint256[](donationCount);
        for (uint256 i; i < donationCount; i++) {
            donationsId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return donationsId;
    }

    function withdraw() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 donationId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, donationId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
