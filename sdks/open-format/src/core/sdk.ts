import { Transaction } from 'ethers';
import merge from 'lodash.merge';
import { invariant } from '../helpers/invariant';
import {
  getProviderFromUrl,
  getProviderUrl,
  getSigner,
} from '../helpers/providers';
import { NFTMetadata, SDKOptions } from '../types';
import { BaseContract } from './base';
import * as contract from './contract';
import { OpenFormatNFT } from './nft';
import * as subgraph from './subgraph';

/**
 * Creates a new instance of the Open Format SDK
 * @public
 */
export class OpenFormatSDK extends BaseContract {
  options: SDKOptions;

  static defaultOptions: SDKOptions = {
    network: 'http://localhost:8545',
  };

  constructor(options?: SDKOptions) {
    super(
      getProviderFromUrl(
        merge({}, OpenFormatSDK.defaultOptions, options).network
      )
    );

    this.options = merge({}, OpenFormatSDK.defaultOptions, options);

    const providerUrl = getProviderUrl(this.options.network);
    this.provider = getProviderFromUrl(providerUrl);

    if (this.options.signer) {
      this.signer = getSigner(this.options.signer, this.provider);
    }
  }

  /**
   * Deploys a version of the Open Format contract
   * @param {Object} nft - the nft to deploy
   * @param {number} nft.maxSupply - the max supply of the nft
   * @param {number} nft.mintingPrice - the amount to mint the nft
   * @param {string} nft.name - name of the nft
   * @param {string} nft.symbol - symbol for the nft
   * @param {string} nft.url - storage URL
   * @returns transaction
   */
  async deploy(nft: NFTMetadata, transactionArgs?: Transaction) {
    invariant(this.signer, 'No signer set, cannot deploy');

    await this.checkNetworksMatch();

    const tx = await contract.deploy({
      signer: this.signer,
      nft,
      transactionArgs,
      factory: this.options.factory,
    });

    return tx;
  }

  /**
   * Returns a new instance of an OpenFormatNFT
   * @param {string} address - Address of a deployed Open Format contract
   * @returns OpenFormatNFT
   */
  getNFT(address: string) {
    return new OpenFormatNFT(address, this.provider, this.signer);
  }

  rawRequest = subgraph.rawRequest;
  getSaleDataForToken = subgraph.getSaleDataForToken;

  /**
   * Gets tokens for a given factory
   * @param {Object} params
   * @param {string} params.factoryId - id of the factory
   * @returns tokens
   */
  getTokens() {
    invariant(typeof this.options.factory === 'string', 'Factory ID not set');
    return subgraph.getTokens({ factoryId: this.options.factory });
  }
}
