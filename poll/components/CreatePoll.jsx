"use client";

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, useConnection, Transaction, SystemProgram } from '@solana/web3.js';
import { Buffer } from 'buffer'; // Ensure you have buffer package installed

const programId = 'YOUR_PROGRAM_ID_HERE'; // Replace with your deployed program ID

export default function CreatePoll() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const createPoll = useCallback(async () => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const pollData = { question, options };
            const pollDataBuffer = Buffer.from(JSON.stringify(pollData));

            // Create transaction and instructions to interact with Solana program
            const transaction = new Transaction().add(
                // Replace with your actual instruction logic
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: publicKey, // Update to correct address
                    lamports: await connection.getMinimumBalanceForRentExemption(pollDataBuffer.length),
                    space: pollDataBuffer.length,
                    programId: programId,
                }),
                // Add more instructions as needed
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);
            alert('Poll created successfully!');
        } catch (err) {
            console.error('Transaction failed:', err);
            setError('Failed to create poll. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [publicKey, question, options, connection, sendTransaction]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Poll</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="text"
                placeholder="Poll Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            {options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
            ))}
            <button
                onClick={createPoll}
                className={`w-full py-2 px-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
                disabled={loading}
            >
                {loading ? 'Creating Poll...' : 'Create Poll'}
            </button>
        </div>
    );
}
