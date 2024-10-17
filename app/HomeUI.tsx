import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toggleUpdateText } from './utils';
import './HomeUI.css';

interface HomeUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  isLoading: boolean;
  notification: string;
  handleButtonClick1: () => void;
  handleButtonClick2: () => void;
  handleButtonClick3: () => void;
  handleClaim1: () => void;
  handleClaim2: () => void;
  handleClaim3: () => void;
}

export default function HomeUI({
  user,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  isLoading,
  notification,
  handleButtonClick1,
  handleButtonClick2,
  handleButtonClick3,
  handleClaim1,
  handleClaim2,
  handleClaim3,
}: HomeUIProps) {
  const [isFarming, setIsFarming] = useState(false);
  const [farmedAmount, setFarmedAmount] = useState(0);

  // Fetch farming status and points when component loads
  useEffect(() => {
    async function fetchFarmingStatus() {
      const response = await fetch('/api/farm/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId })
      });
      const data = await response.json();
      if (data.isFarming) {
        setIsFarming(true);
        setFarmedAmount(data.farmedAmount);
      }
    }
    fetchFarmingStatus();
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    toggleUpdateText();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFarming) {
      interval = setInterval(() => {
        setFarmedAmount(prev => prev + 1); // Increment by 1 every minute
      }, 1000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isFarming]);

  const handleFarmClick = async () => {
    if (!isFarming) {
      setIsFarming(true);
      setFarmedAmount(0);
      await fetch('/api/farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId, action: 'start' })
      });
    } else {
      setIsFarming(false);
      const response = await fetch('/api/farm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.telegramId, action: 'collect' })
      });
      const data = await response.json();
      if (data.success) {
        // Update user's points
        // You might want to update the user state here or refetch user data
      }
    }
  };

  return (
    <div className="home-container">
      <div className="header-container">
        <div className="dog-image-container">
          <img
            alt="Animated style dog image"
            className="dog-image"
            src="https://storage.googleapis.com/a1aa/image/YlpvEfbklKRiDi8LX5Rww5U3zZZwHEUfju1qUNknpEZ6e2OnA.jpg"
          />
        </div>
        <p id="pixelDogsCount" className="pixel-dogs-count">
          {user.points} PixelDogs
        </p>
        <p id="updateText" className="update-text fade fade-in">
          Exciting updates are on the way:)
        </p>
        <div className="tasks-container">
          <button className="tasks-button">Daily Tasks..!</button>
          <div className="social-container">
            <p className="social-text">Follow Our Youtube!</p>
            <button
              onClick={() => {
                if (buttonStage1 === 'check') {
                  handleButtonClick1();
                } else if (buttonStage1 === 'claim') {
                  handleClaim1();
                }
              }}
              disabled={buttonStage1 === 'claimed' || isLoading}
              className={`claim-button ${
                buttonStage1 === 'claimed' || isLoading ? 'disabled' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="social-container">
            <p className="social-text">Follow Our Twitter!</p>
            <button
              onClick={() => {
                handleButtonClick2();
                handleClaim2();
              }}
              disabled={buttonStage2 === 'claimed'}
              className="claim-button"
            >
              {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="social-container">
            <p className="social-text">Join Our Telegram!</p>
            <button
              onClick={() => {
                handleButtonClick3();
                handleClaim3();
              }}
              disabled={buttonStage3 === 'claimed'}
              className="claim-button"
            >
              {buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
      <button className="farm-button" onClick={handleFarmClick}>
        {isFarming ? `Farming... ${farmedAmount} PD` : 'Farm PixelDogs...'}
      </button>
      <div className="footer-container">
        <Link href="/">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-home text-2xl"></i>
            <p className="text-sm">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-users text-2xl"></i>
            <p className="text-sm">Friends</p>
          </a>
        </Link>
        <Link href="/wallet">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-wallet text-2xl"></i>
            <p className="text-sm">Wallet</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
