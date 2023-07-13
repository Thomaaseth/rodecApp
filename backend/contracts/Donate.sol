// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Donate contract
 * @dev Implements donations in exchange for ERC721 tokens.
 * @author Thomas for Alyra
 */
contract Donate is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counter for donation IDs
    Counters.Counter private _donationIds;

    // Structure for donation details
    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }

    // Mapping from donationId to Donation struct
    mapping(uint256 => Donation) public donations;

    /**
     * @dev Event emitted when a new donation is made
     */
    event NewDonation(
        address indexed sender,
        uint256 indexed donationId,
        uint256 amount,
        uint256 timestamp
    );

    // Minimum donation amount
    uint256 private _price = 50000000000000;

    /**
     * @dev Sets the name and symbol of the token
     */
    constructor() ERC721("RoDec", "RDC") {}

    /**
     * @dev Enables external accounts to make a donation and receive an ERC721 token
     */
    function donate() external payable {
        require(msg.value >= _price, "Amount too low");

        uint256 newDonationId = _donationIds.current();
        _safeMint(msg.sender, newDonationId);
        donations[newDonationId] = Donation({
            amount: msg.value,
            timestamp: block.timestamp
        });
        _donationIds.increment();

        emit NewDonation(msg.sender, newDonationId, msg.value, block.timestamp);
    }

    /**
     * @dev Returns the current donation price
     */
    function getPrice() public view returns (uint256) {
        return _price;
    }

    /**
     * @dev Allows the owner to set a new donation price
     */
    function setPrice(uint _newPrice) external onlyOwner {
        _price = _newPrice;
    }

    /**
     * @dev Returns the total number of donations made
     */
    function nbDonationsTotal() external view returns (uint256) {
        return _donationIds.current();
    }

    /**
     * @dev Returns the details of a specific donation
     */
    function getDonationDetails(
        uint256 donationId
    ) public view returns (uint256, uint256) {
        require(_exists(donationId), "Donation does not exist");
        Donation memory donation = donations[donationId];
        return (donation.amount, donation.timestamp);
    }

    /**
     * @dev Returns a list of donation IDs for a given address
     */
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

    /**
     * @dev Allows the owner to withdraw all funds from the contract
     */
    function withdraw() external payable onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Overrides _beforeTokenTransfer function to restrict transfers of tokens
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        require(from == address(this), "Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Overrides supportsInterface to use multiple inheritance in contract
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
