// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Donate is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Donation) public donations;

    event NewDonation(
        address sender,
        uint256 tokenId,
        uint256 amount,
        uint256 timestamp
    );

    uint256 price = 50000000000000;
    address public renderingContractAddress;

    constructor() ERC721("RoDec", "RDC") {}

    function donate() external payable {
        require(msg.value > price, "Amount needs to be superior to 0");

        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        donations[newTokenId] = Donation({
            amount: msg.value,
            timestamp: block.timestamp
        });
        emit NewDonation(msg.sender, tokenId, amount, timestamp);
        _setTokenURI(newTokenId, tokenURI);
        _tokenIds.increment();
    }

    function setRenderingContractAddress(
        address _renderingContractAddress
    ) external onlyOwner {
        renderingContractAddress = _renderingContractAddress;
    }

    function setPrice(uint _price) external onlyOwner {
        price = _price;
    }

    function totalDonationsId() external view returns (uint256) {
        return _tokenIds.current();
    }

    function tokenURI(
        uint256 _tokenId
    ) external view virtual override returns (string memory) {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent donation"
        );
        if (renderingContractAddress == address(0)) {
            return "";
        }
        IItemRenderer renderer = IItemRenderer(renderingContractAddress);
        return renderer.tokenURI(_tokenId, donations[_tokenId]);
    }

    function withdraw() external onlyOwner nonReetrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
