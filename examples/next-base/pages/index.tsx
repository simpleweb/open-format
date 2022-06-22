import { ConnectButton, useDeploy, useRawRequest, useSaleData, useWallet } from '@simpleweb/open-format-react';
import {  ChangeEvent, FormEvent, useEffect } from "react";
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/logo';
import styles from '../styles/Home.module.css'
import { useState } from "react";
import { gql } from 'graphql-request';


const Home: NextPage = () => {
  const { isConnected } = useWallet();
  const [mintingPrice, setMintingPrice] = useState<number>(0.01);
  const [maxSupply, setMaxSupplySupply] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const handleChangeSalePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setMintingPrice(parseInt(e.currentTarget.value));
  };
  const handleChangeMaxSupply = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxSupplySupply(parseInt(e.currentTarget.value));
  };
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const handleChangeSymbol = (e: ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.currentTarget.value);
  };

  const { deploy, data: contractData } = useDeploy();
  console.log({ctxData: contractData?.contractAddress});
  
  const {data: saleData} = useSaleData({

    tokenId: "0x7c5d3ccd02df7b77ff36fb01e3f69f6f10cb9474"
  });

  console.log(saleData);

  
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deploy({
          maxSupply,
          mintingPrice,
          name,
          symbol,
          url: 'ipfs://',
        })
    } catch(e) {
      console.log(e);  
    }
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome tp open format</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
         Welcome to the Open-Format Starter
        </h1>
        <p>
          <a className={styles.link} href='https://github.com/simpleweb/open-format/tree/main/sdks/react' target="_blank" rel="noopener noreferrer">
          Back to the documentation
          </a>
        </p>

        <p >
          Create Your Next NFT platform
        </p>

        <p>
          No need to build your own connection button we have sorted all that for you, Click below to see how easy it is to connect your wallet!!
        </p>
        

        <div className={styles.grid}>
          <ConnectButton className={styles.button} />
        </div>

      <div className={styles.formContainer}>
        <h2 className={styles.subtitle}>Deploy Your NFT here</h2>
        <div>
            <form
              onSubmit={(e) => submit(e)}
              className={styles.form}
            >
        
                <label htmlFor="salePrice">Name
                <input
                  className={styles.input}
                  placeholder='Enter a name here'
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChangeName}
                  value={name}
                /></label>
        
              <label htmlFor="playerTwo">Symbol
              <input
                className={styles.input}
                placeholder='Blockchain ID'
                type="text"
                id="symbol"
                name="symbol"
                onChange={handleChangeSymbol}
                value={symbol}
              /></label>
        
              <label htmlFor="salePrice">Sale Price
              <input
                className={styles.input}
                type="number"
                id="salePrice"
                name="salePrice"
                onChange={handleChangeSalePrice}
                value={mintingPrice}
              /></label>
        
              <label
              className={styles.label}
              htmlFor="playerTwo">Max Supply
              <input
                className={styles.input}
                type="number"
                id="maxSupply"
                name="maxSupply"
                onChange={handleChangeMaxSupply}
                value={maxSupply}
              /></label>
        
        
            <>
            {isConnected && (
              <button className={styles.buttonDeploy}
              >
                Deploy NFT
              </button>
            )}
                  </>
             </form>
          </div>
      </div>
        
      </main>

      <footer className={styles.footer}>
        <Link href={'https://simpleweb.co.uk'}>
        <a>
        <Logo />
        </a>
        </Link>
      </footer>
    </div>
  )
}

export default Home
