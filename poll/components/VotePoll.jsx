"use client";

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/web3.js';
import { Transaction, PublicKey } from '@solana/web3.js'; // Ensure correct import
import { SystemProgram } from '@solana/web3.js'; // Import if using SystemProgram

const programId = 'YOUR_PROGRAM_ID_HERE'; // Replace with your deployed program ID

export default function VotePoll() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [pollId, setPollId] = useState('');
    const [optionIndex, setOptionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVote = useCallback(async () => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }

        if (!pollId || optionIndex < 0) {
            alert('Please provide valid Poll ID and Option Index.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Construct the transaction with correct instructions for your Solana program
            const transaction = new Transaction().add(
                // This should be replaced with actual program logic
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(programId), // Replace this with the actual destination pubkey if needed
                    lamports: 0, // Replace with actual amount if needed
                })
            );

            // Send the transaction
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);

            alert('Vote cast successfully!');
        } catch (err) {
            console.error('Transaction failed:', err);
            setError('Failed to cast vote. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [pollId, optionIndex, publicKey, connection, sendTransaction]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Vote on Poll</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="text"
                placeholder="Poll ID"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
                type="number"
                placeholder="Option Index"
                value={optionIndex}
                onChange={(e) => setOptionIndex(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
                onClick={handleVote}
                className={`w-full py-2 px-4 ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white rounded hover:bg-green-600`}
                disabled={loading}
            >
                {loading ? 'Casting Vote...' : 'Vote'}
            </button>
        </div>
    );
}
