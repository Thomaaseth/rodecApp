// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nbNftSold;
    Counters.Counter private _nftCount;

    uint256 public fee = 0.0005 ether;
    address payable private _marketOwner;

    mapping(uint256 => NFT) private _idNFT;

    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
    };

    event NFTListed (
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event NFTSold (
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    constructor() {
        _marketOwner = payable(msg.sender);
    }

    // List NFTs to sell

    function listNft(address _nftContract, uint256 _tokenId, uint256 _price) external payable nonReentrant {
        require(_price > 0, "Price must not be 0");
        require(msg.value == fee, "Not enough ETH");
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        _marketOwner.transfer(fee);
        _nftCount.increment();

        _idNFT[_tokenId] = NFT(
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            true
        );
        emit NFTListed(_nftContract, _tokenId, msg.sender, _price)
    };

    // Buy an NFT

    function buyNft(address _nftContract, uint256 _tokenId) external payable nonReentrant {
        NFT storage nft _idNft[_tokenId];
        require(msg.value >= nft.price, "Not enough ETH to buy");

        address payable buyer = payable(msg.sender);
        payable(nft.seller).transfer(msg.value);
        IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
        nft.owner = buyer;
        nft.listed = false;

        _nbNftSold.increment();
        emit NFTSold(_nftContract, nft.tokenId, nft.seller, nft.buyer, msg.value);
    };

    function sellNftBought(address _nftContract, uint256 _tokenId, uint256 _price) external payable nonReentrant {
        require(_price > 0, "Price must not be 0");
        require(msg.value == fee, "Not enough funds to list");

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        NFT storage nft = _idNft[_tokenId];
        nft.seller = payable(msg.sender);
        nft.owner = payable(address(this));
        nft.listed = true;
        nft.price = _price;

        _nbNftSold.decrement();
        emit NFTListed(_nftContract, _tokenId, msg.sender, address(this), _price);
    };

    function getListedNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 availNftCount = nftCount - _nbNftSold.current();

        NFT[] memory nfts = new NFT[](availNftCount);
        uint nftsIndex = 0;
        for(uint i = 0; i < nftCount; i++) {
            if(_idNFT[i + 1].listed) {
                nfts[nftsIndex] = _idNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyNfts() external view returns (NFT[] memory) {
        uint nftCount = _nftCount.current();
        uint myNftNb = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idNFT[i + 1].owner == msg.sender) {
                myNftNb++;
            }      
        }

        NFT[] memory nfts = new NFT[](myNftNb);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idNFT[i + 1].owner == msg.sender) {
                nfts[nftsIndex] = _idNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyListedNfts() external view returns (NFT[] memory) {
        uint nftCount = _nftCount.current();
        uint myListedNftNb = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idNFT[i +1].seller == msg.sender && _idNFT[i + 1].listed) {
            myListedNftNb++;
            }
        }

        NFT[] memory nfts = new NFT[](myListedNftNb);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if(_idNFT[i + 1].seller && _idNFT[i + 1].listed) {
                nfts[nftsIndex] = _idNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

}
