"use client"; // Mark this component as a Client Component

import React, { useState } from 'react';
import './buttons.css'; // Import the external CSS file

export default function Buttons() {
    const [stage, setStage] = useState('check'); // Track button stage ('check', 'claim', 'claimed')

    const handleClick = () => {
        if (stage === 'check') {
            window.open('https://www.youtube.com', '_blank');
            setStage('claim'); // Change to claim stage after opening YouTube
        } else if (stage === 'claim') {
            setStage('claimed'); // Change to claimed stage
        }
    };

    return (
        <div>
            <h1>Basic Buttons</h1>
            <div>
                <button 
                    onClick={handleClick} 
                    disabled={stage === 'claimed'} 
                    className={stage}
                >
                    {stage === 'check' && 'Check'}
                    {stage === 'claim' && 'Claim'}
                    {stage === 'claimed' && 'Claimed'}
                </button>
            </div>
            <button>Button 2</button>
            <button>Button 3</button>
            <button>Button 4</button>
        </div>
    );
}
