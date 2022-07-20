import { providers, Signer } from 'ethers';
import { BaseContract } from './base';
import * as contract from './contract';

/**
 * Creates a new instances of the OpenFormatNFT class which allows you to interact with a single deployed NFT
 */
export class OpenFormatNFT extends BaseContract {
  address: string;
  signer: Signer;

  constructor(address: string, provider: providers.Provider, signer: Signer) {
    super(provider, signer);
    this.address = address;
    this.signer = signer;
  }

  /**
   * Mints an NFT from a deployed Open Format contract
   * @returns transaction
   */
  async mint() {
    await this.checkNetworksMatch();

    return contract.mint({
      contractAddress: this.address,
      signer: this.signer,
    });
  }
}
