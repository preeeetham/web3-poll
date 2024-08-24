"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ConnectionProvider, WalletProvider, WalletAdapterNetwork } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolletWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Create Wallet Context
const WalletContext = createContext();

export function WalletProviderComponent({ children }) {
    const [wallet, setWallet] = useState(null);
    const [network, setNetwork] = useState(WalletAdapterNetwork.Testnet); // Changed to Testnet

    const networkUrl = clusterApiUrl(network);

    const initializeAdapters = useCallback(() => {
        const phantom = new PhantomWalletAdapter();
        const sollet = new SolletWalletAdapter();
        const solflare = new SolflareWalletAdapter();

        phantom.on('connect', () => setWallet(phantom.publicKey));
        phantom.on('disconnect', () => setWallet(null));

        sollet.on('connect', () => setWallet(sollet.publicKey));
        sollet.on('disconnect', () => setWallet(null));

        solflare.on('connect', () => setWallet(solflare.publicKey));
        solflare.on('disconnect', () => setWallet(null));

        return [phantom, sollet, solflare];
    }, [network]);

    useEffect(() => {
        const [phantom, sollet, solflare] = initializeAdapters();

        return () => {
            // Clean up event listeners
            phantom.off('connect');
            phantom.off('disconnect');

            sollet.off('connect');
            sollet.off('disconnect');

            solflare.off('connect');
            solflare.off('disconnect');
        };
    }, [initializeAdapters]);

    const handleWalletError = (error) => {
        // Handle wallet errors (e.g., show notifications)
        console.error('Wallet error:', error);
    };

    return (
        <ConnectionProvider endpoint={networkUrl}>
            <WalletProvider wallets={initializeAdapters()} onError={handleWalletError}>
                <WalletContext.Provider value={{ wallet, network, setNetwork }}>
                    {children}
                </WalletContext.Provider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export const useWalletContext = () => useContext(WalletContext);
