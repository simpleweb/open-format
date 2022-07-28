import base from '@simpleweb/open-format-contracts';
import { BigNumberish, ethers, Signer, Transaction } from 'ethers';
import { NFTStorage } from 'nft.storage';
import { OpenFormat } from '../contract-types';
import { invariant } from '../helpers/invariant';
import isZeroAddress from '../helpers/zeroAddress';
import { NFTMetadata } from '../types';

const nftStorage = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVkMjJDZDg2M2Y2NUVBN0ZjZjI3MEE5MUY2NTE5Nzc4OGRhRjU4NmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTAxMTU3OTQ2NSwibmFtZSI6Ik9wZW4gRm9ybWF0In0.v-0FkXH0IpVB_JdyG6Ho6kXPqy4DOVr_HZzsks3DES4',
});

type ContractArgs = {
  contractAddress: string;
  signer: Signer;
};

function getContract({ contractAddress, signer }: ContractArgs) {
  return new ethers.Contract(contractAddress, base.abi, signer) as OpenFormat;
}

export async function mint({ contractAddress, signer }: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const mintingPrice = await openFormat.mintingPrice();

  const tx = await openFormat['mint()']({
    value: mintingPrice,
  });

  const receipt = await tx.wait();

  return receipt;
}

export async function mintWithCommission({
  address,
  contractAddress,
  signer,
}: ContractArgs & {
  address: string;
}) {
  const openFormat = getContract({ contractAddress, signer });

  const mintingPrice = await openFormat.mintingPrice();

  const tx = await openFormat['mint(address)'](address, {
    value: mintingPrice,
  });

  const receipt = await tx.wait();

  return receipt;
}

export async function setMintingPrice({
  price,
  contractAddress,
  signer,
}: ContractArgs & {
  price: BigNumberish;
}) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setMintingPrice(price);

  const receipt = await tx.wait();

  return receipt;
}

export async function setApprovedMintingExtension({
  extensionContractAddress,
  contractAddress,
  signer,
}: ContractArgs & {
  extensionContractAddress: string;
}) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setApprovedMintingExtension(
    extensionContractAddress
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function setRoyalties({
  contractAddress,
  signer,
  royaltyReceiverAddress,
  royaltyPercentage,
}: ContractArgs & {
  royaltyReceiverAddress: string;
  royaltyPercentage: number;
}) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setRoyalties(
    royaltyReceiverAddress,
    royaltyPercentage
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function getRoyalties({
  contractAddress,
  signer,
  salePrice,
}: ContractArgs & { salePrice: number }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.royaltyInfo(0, salePrice);

  return tx;
}

export async function setupRevenueSharing({
  contractAddress,
  signer,
  revShareExtensionAddress,
  collaborators,
  holderPercentage,
}: ContractArgs & {
  revShareExtensionAddress: string;
  collaborators: {
    address: string;
    share: BigNumberish;
  }[];
  holderPercentage: BigNumberish;
}) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setApprovedRevShareExtension(
    revShareExtensionAddress,
    collaborators.map(collaborator => collaborator.address),
    collaborators.map(collaborator => collaborator.share),
    holderPercentage
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function allocateRevenueShares({
  allocation,
  contractAddress,
  signer,
}: ContractArgs & {
  allocation: {
    address: string;
    share: BigNumberish;
  }[];
}) {
  const openFormat = getContract({ contractAddress, signer });
  const approved = await openFormat.approvedRevShareExtension();

  if (isZeroAddress(approved)) {
    throw new Error(`Revenue sharing has not been setup`);
  }

  const tx = await openFormat.allocateShares(
    allocation.map(a => a.address),
    allocation.map(a => a.share)
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function withdrawCollaboratorFunds({
  address,
  contractAddress,
  signer,
}: ContractArgs & { address: string }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat['withdraw(address)'](address);

  const receipt = await tx.wait();

  return receipt;
}

export async function getCollaboratorBalance({
  address,
  contractAddress,
  signer,
}: ContractArgs & { address: string }) {
  const openFormat = getContract({ contractAddress, signer });

  const balance = await openFormat.getSingleCollaboratorBalance(address);

  return balance;
}

export async function withdrawTokenFunds({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat['withdraw(uint256)'](tokenId);

  const receipt = await tx.wait();

  return receipt;
}

export async function getTokenBalance({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const balance = await openFormat.getSingleTokenBalance(tokenId);

  return balance;
}

export async function setPrimaryCommissionPercent({
  percent,
  contractAddress,
  signer,
}: ContractArgs & { percent: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setPrimaryCommissionPct(percent);

  const receipt = await tx.wait();

  return receipt;
}

export async function getPrimaryCommissionPercent({
  contractAddress,
  signer,
}: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const percent = await openFormat.getPrimaryCommissionPct();

  return percent;
}

export async function setSecondaryCommissionPercent({
  percent,
  contractAddress,
  signer,
}: ContractArgs & { percent: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setSecondaryCommissionPct(percent);

  const receipt = await tx.wait();

  return receipt;
}

export async function getSecondaryCommissionPercent({
  contractAddress,
  signer,
}: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const percent = await openFormat.getSecondaryCommissionPct();

  return percent;
}

export async function setTokenSalePrice({
  tokenId,
  price,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish; price: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setTokenSalePrice(tokenId, price);

  const receipt = await tx.wait();

  return receipt;
}

export async function getTokenCreator({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({
    contractAddress,
    signer,
  });

  const creator = await openFormat.creatorOf(tokenId);

  return creator;
}

export async function getTokenSalePrice({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const price = await openFormat.getTokenSalePrice(tokenId);

  return price;
}

export async function getMaxSupply({ contractAddress, signer }: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const supply = await openFormat.getMaxSupply();

  return supply;
}

export async function setMaxSupply({
  amount,
  contractAddress,
  signer,
}: ContractArgs & { amount: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.setMaxSupply(amount);

  const receipt = await tx.wait();

  return receipt;
}

export async function getTotalSupply({
  contractAddress,
  signer,
}: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const supply = await openFormat.getTotalSupply();

  return supply;
}

export async function buy({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tokenSalePrice = await openFormat.getTokenSalePrice(tokenId);

  const tx = await openFormat['buy(uint256)'](tokenId, {
    value: tokenSalePrice,
  });

  const receipt = await tx.wait();

  return receipt;
}

export async function buyWithCommission({
  tokenId,
  address,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish; address: string }) {
  const openFormat = getContract({ contractAddress, signer });

  const tokenSalePrice = await openFormat.getTokenSalePrice(tokenId);
  const secondaryCommissionPct = await openFormat.getSecondaryCommissionPct();

  const commission = tokenSalePrice.mul(secondaryCommissionPct).div(10000);

  const tx = await openFormat['buy(uint256,address)'](tokenId, address, {
    value: tokenSalePrice.add(commission),
  });

  const receipt = await tx.wait();

  return receipt;
}

export async function togglePauseState({
  contractAddress,
  signer,
}: ContractArgs) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.togglePausedState();

  const receipt = await tx.wait();

  return receipt;
}

export async function burn({
  tokenId,
  contractAddress,
  signer,
}: ContractArgs & { tokenId: BigNumberish }) {
  const openFormat = getContract({ contractAddress, signer });

  const tx = await openFormat.burn(tokenId);

  const receipt = await tx.wait();

  return receipt;
}

/**
 * Deploys a version of the Open Format contract
 * @private
 * @param {Object} params - the signer and nft for the deploy
 * @param {Signer} params.signer - signer of the contract
 * @param {NFTMetadata} params.nft - metadata about the NFT to deploy
 * @returns receipt
 */
export async function deploy({
  signer,
  nft,
  transactionArgs,
  factory,
}: {
  signer: Signer;
  nft: NFTMetadata;
  transactionArgs?: Transaction;
  factory?: string;
}) {
  const openFormatContract = new ethers.ContractFactory(
    base.abi,
    base.bytecode,
    signer
  );

  let url = nft.url;

  if (typeof url === 'undefined' && factory) {
    invariant(nft.description, 'A description must be set');
    invariant(nft.image, 'An image must be set');
    invariant(nft.releaseType, 'A release type must be set');

    const customMetadata = nft.metadata ?? {};

    const metadata = await nftStorage.store({
      name: nft.name,
      description: nft.description,
      image: nft.image,
      factory_id: factory,
      release_type: nft.releaseType,
      ...customMetadata,
    });

    url = metadata.url;
  }

  invariant(url, 'An IPFS URL must be set');

  const contract = await openFormatContract.deploy(
    nft.name,
    nft.symbol,
    url,
    nft.maxSupply,
    ethers.utils.parseEther(nft.mintingPrice.toString()),
    { ...transactionArgs }
  );

  const receipt = await contract.deployTransaction.wait();

  await contract.deployed();

  return receipt;
}
