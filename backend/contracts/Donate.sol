// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Donation Contract
/// @notice A contract for making donations and minting associated NFTs
/// @dev Utilizes OpenZeppelin for secure, standardized functionality
contract Donate is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _donationIds;

    /// @notice The details of a specific donation
    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }

    /// @notice Mapping from a donation ID to the specific details of that donation
    mapping(uint256 => Donation) public donations;

    event NewDonation(
        address sender,
        uint256 newDonationId,
        uint256 amount,
        uint256 timestamp
    );

    uint256 private _price = 50000000000000;
    string public baseURI;

    using Strings for uint;

    constructor(string memory _baseURI) ERC721("RoDec", "RDC") {
        baseURI = _baseURI;
    }

    /// @notice Make a donation and mint an associated NFT
    /// @dev Donor must send enough Ether to cover the price of the donation
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

    /// @notice Set the base URI for all token IDs
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function _getBaseURI()
        internal
        view
        override(ERC721)
        returns (string memory)
    {
        return baseURI;
    }

    /// @notice Get the URI for a specific token ID
    function tokenURI(
        uint _tokenId
    ) public view virtual override(ERC721A) returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /// @notice Set the price for making a donation
    function setPrice(uint _newPrice) external onlyOwner {
        _price = _newPrice;
    }

    /// @notice Get the current price for making a donation
    function getPrice() public view returns (uint256) {
        return _price;
    }

    /// @notice Get the total number of donations made so far
    function nbDonationsTotal() external view returns (uint256) {
        return _donationIds.current();
    }

    /// @notice Get the details for a specific donation
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

    /// @notice Get the IDs of all donations made by a specific address
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

    /// @notice Withdraw all Ether from the contract
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
