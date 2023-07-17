// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Mint contract
 * @dev Implements a contract for a mintint ERC721 tokens.
 * @author Thomas for Alyra
 */

contract Mint is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint private constant MAX_SUPPLY = 20;
    uint private constant PRICE = 0.03 ether;
    string public baseURI;
    using Strings for uint;

    address marketplaceContract;

    /// @notice Event emitted when an NFT is minted.
    event NFTMinted(uint256);

    mapping(address => uint) amountNftMinted;

    /// @notice Contract constructor that sets base URI and marketplace contract.
    /// @param _baseURI The base URI for the token metadata.
    /// @param _marketplaceContract The marketplace contract address.
    constructor(
        string memory _baseURI,
        address _marketplaceContract
    ) ERC721("RoDecNFT", "RTR") {
        baseURI = _baseURI;
        marketplaceContract = _marketplaceContract;
    }

    /// @notice Function to mint tokens.
    /// @param quantity The number of tokens to mint.
    function mint(uint256 quantity) external payable {
        require(totalSupply() + quantity <= MAX_SUPPLY, "Sold out");
        // require(
        //     msg.value == quantity * PRICE * 10 ** 18,
        //     "Not enough ETH in wallet"
        // );

        for (uint256 i = 0; i < quantity; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            amountNftMinted[msg.sender]++;
            _safeMint(msg.sender, newTokenId);

            emit NFTMinted(newTokenId);
        }
    }

    /// @notice Sets the base URI for the token metadata.
    /// @param _baseURI The base URI for the token metadata.
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /// @notice Returns the token URI for a specific token ID.
    /// @param _tokenId The ID of the token.
    /// @return The token URI.
    function tokenURI(
        uint256 _tokenId
    ) public view virtual override(ERC721URIStorage) returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /// @notice Withdraws Ether from the contract.
    function withdraw() external payable onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /// @notice Returns the total supply of the token.
    /// @return The total supply.
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    /// @notice Approves the marketplace for all tokens.
    function approveMarketplace() external {
        setApprovalForAll(marketplaceContract, true);
    }
}
