import React from 'react';
import CreatePoll from '../components/CreatePoll';
import VotePoll from '../components/VotePoll';
import { WalletProviderComponent } from '../components/WalletContext';

export default function Home() {
    return (
        <WalletProviderComponent>
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-4xl font-bold mb-8">Decentralized Polling</h1>
                <CreatePoll />
                <VotePoll />
            </div>
        </WalletProviderComponent>
    );
}
