// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mint is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint private constant MAX_SUPPLY = 1000;
    uint private constant PRICE = 0.03 ether;
    string public baseURI;
    using Strings for uint;

    address marketplaceContract;

    event NFTMinted(uint256);

    mapping(address => uint) amountNftMinted;

    constructor(
        string memory _baseURI,
        address _marketplaceContract
    ) ERC721("RoDecNFT", "RTR") {
        baseURI = _baseURI;
        marketplaceContract = _marketplaceContract;
    }

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
            setApprovalForAll(marketplaceContract, true);

            emit NFTMinted(newTokenId);
        }
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override(ERC721URIStorage) returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    function withdraw() external payable onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}