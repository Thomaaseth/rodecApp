// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Marketplace contract
 * @dev Implements a contract for a marketplace for trading ERC721 tokens.
 * @author Thomas for Alyra
 */

contract Marketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nbNftSold;
    Counters.Counter private _nftCount;
    Counters.Counter private _tokenIds;

    address payable private _marketOwner;
    uint256 public listFee = 0.005 ether;

    mapping(uint256 => NFT) public _idNFT;
    uint256[] private _allNfts;

    /// @notice Struct for a NFT.
    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
    }

    /// @notice Event for when a NFT is listed.
    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    /// @notice Event for when a NFT is sold.
    event NFTSold(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    /// @notice Contract constructor.
    constructor() ERC721("RoDecNFT", "RDNFT") {
        _marketOwner = payable(msg.sender);
    }

    /// @notice Lists a NFT to sell.
    /// @param _nftContract The contract of the NFT.
    /// @param _tokenId The ID of the NFT.
    /// @param _price The price of the NFT.
    function listNft(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external payable nonReentrant {
        require(_price > 0, "Price must not be 0");
        require(msg.value == listFee, "Not enough ETH");

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        _nftCount.increment();
        _allNfts.push(_tokenId);

        _idNFT[_tokenId] = NFT(
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            true
        );
        _marketOwner.transfer(listFee);

        emit NFTListed(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price
        );
    }

    /// @notice Buys a NFT.
    /// @param _nftContract The contract of the NFT.
    /// @param _tokenId The ID of the NFT.
    function buyNft(
        address _nftContract,
        uint256 _tokenId
    ) external payable nonReentrant {
        NFT storage nft = _idNFT[_tokenId];
        require(msg.value == nft.price, "Not enough ETH to buy");

        address payable buyer = payable(msg.sender);
        IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
        nft.owner = buyer;
        nft.listed = false;

        _nbNftSold.increment();
        emit NFTSold(_nftContract, nft.tokenId, nft.seller, buyer, msg.value);
        payable(nft.seller).transfer(msg.value);
    }

    /// @notice Sell a NFT.
    /// @param _nftContract The contract of the NFT.
    /// @param _tokenId The ID of the NFT.
    /// @param _price The price of the NFT.
    function sellNft(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external payable nonReentrant {
        NFT storage nft = _idNFT[_tokenId];
        require(_price > 0, "Price must not be 0");
        require(msg.value == listFee, "Not enough funds to list");
        require(
            msg.sender == nft.owner,
            "Only the owner can list this NFT for sale"
        );

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        nft.seller = payable(msg.sender);
        nft.owner = payable(address(this));
        nft.listed = true;
        nft.price = _price;

        _nbNftSold.decrement();
        emit NFTListed(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price
        );
    }

    /// @notice Gets all listed NFTs.
    /// @return An array of NFT structs.
    function getListedNfts() public view returns (NFT[] memory) {
        uint256 totalNfts = _allNfts.length;
        uint256 listedNftCount = totalNfts - _nbNftSold.current();

        NFT[] memory nfts = new NFT[](listedNftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < totalNfts; i++) {
            NFT storage nft = _idNFT[_allNfts[i]];
            if (nft.listed) {
                nfts[nftsIndex] = nft;
                nftsIndex++;
            }
        }
        return nfts;
    }

    /// @notice Gets all owned NFTs of the caller.
    /// @return An array of NFT structs.
    function getMyNfts() external view returns (NFT[] memory) {
        uint256 totalNfts = _allNfts.length;
        uint myNftNb = 0;
        for (uint i = 0; i < totalNfts; i++) {
            NFT storage nft = _idNFT[_allNfts[i]];
            if (nft.owner == msg.sender) {
                myNftNb++;
            }
        }

        NFT[] memory nfts = new NFT[](myNftNb);
        uint nftsIndex = 0;

        for (uint i = 0; i < totalNfts; i++) {
            NFT storage nft = _idNFT[_allNfts[i]];
            if (nft.owner == msg.sender) {
                nfts[nftsIndex] = nft;
                nftsIndex++;
            }
        }
        return nfts;
    }

    /// @notice Gets all listed NFTs of the caller.
    /// @return An array of NFT structs.
    function getMyListedNfts() external view returns (NFT[] memory) {
        uint256 totalNfts = _allNfts.length;
        uint myListedNftNb = 0;

        for (uint i = 0; i < totalNfts; i++) {
            NFT storage nft = _idNFT[_allNfts[i]];
            if (nft.seller == msg.sender && nft.listed) {
                myListedNftNb++;
            }
        }

        NFT[] memory nfts = new NFT[](myListedNftNb);
        uint nftsIndex = 0;

        for (uint i = 0; i < totalNfts; i++) {
            NFT storage nft = _idNFT[_allNfts[i]];
            if (nft.seller == msg.sender && nft.listed) {
                nfts[nftsIndex] = nft;
                nftsIndex++;
            }
        }
        return nfts;
    }
}
