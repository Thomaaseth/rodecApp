This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# RodecApp

RodecApp is a decentralized application (DApp) built on the Ethereum blockchain that allows users to donate funds to a cause and receive ERC721 tokens in return. The application is built with Solidity, React (Next.js), ethers.js, and uses the Alchemy API to interact with the Ethereum network.

## Features

1. **Blockchain Integration**: RodecApp uses the Ethereum blockchain to process and validate donations. The transparency of the blockchain ensures that all donations are publicly auditable.

2. **Donation and Token Exchange**: Users can donate funds and receive unique ERC721 tokens in return. Each donation is tied to a specific ERC721 token that serves as a certificate for proof of donation. These tokens are non-transferable, reinforcing the concept that donations should not be a tradable commodity.

3. **Donation Tracking**: Users can view their donation history, including details (i.e. amount, date) about the ERC721 tokens they have received, at any time, thanks to the immutability of the blockchain.

4. **Admin Capabilities**: Admins have the ability to withdraw funds collected from the donations and change the donation prices.

## Installation & Deployment

Follow these steps to install and deploy RodecApp.

### Prerequisites

1. Node.js and npm/yarn installed on your local machine.
2. Alchemy API key.
3. Metamask browser extension installed and set up.
4. GitHub account.
5. Vercel account.

### Local Setup

1. Clone the repository to your local machine.
2. Install the dependencies using `yarn install` or `npm install`.
3. Create a `.env` file in your root directory and add the following variables:
- API_URL=<Your Alchemy or Infura API URL>
- MNEMONIC=<Your Ethereum wallet secret phrase>
4. Start the local development server using `yarn dev` or `npm run dev`.

### Deployment on Vercel

1. Push your local codebase to a GitHub repository.
2. Log into your Vercel account and click on "Import Project".
3. Import the GitHub repository you just pushed to.
4. Deploy the project.

After the successful deployment, you will receive a unique URL to access your deployed application.

## License

[MIT](https://choosealicense.com/licenses/mit/)
