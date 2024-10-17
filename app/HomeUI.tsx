import Link from 'next/link';
import { useEffect } from 'react';
import { toggleUpdateText } from './utils'; // Import the function from utils.js
import './HomeUI.css'; // Import your CSS file

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
  useEffect(() => {
    toggleUpdateText(); // Call the function to toggle update text
  }, []);

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
      <button className="farm-button">Farm PixelDogs...</button>
      <p id="updateText" className="update-text fade fade-in">
        Exciting updates are on the way, keep farming :)
      </p>
      <div className="footer-container">
        <Link href="/" className="footer-link">
  <i className="bi bi-house footer-icon"></i>
  <p className="footer-text">Home</p>
          <Link href="/" className="footer-link">
  <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7h3v8h4V9h2v6h4V7h3L12 2z" />
  </svg>
  <p className="footer-text">Home</p>
</Link>
<Link href="/invite" className="footer-link">
  <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 00-7.547 16.52A10.006 10.006 0 0112 22a10 10 0 007.547-3.48A10 10 0 0012 2z" />
  </svg>
  <p className="footer-text">Friends</p>
</Link>
<Link href="/wallet" className="footer-link">
  <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm0 2v16h18V5H3z" />
  </svg>
  <p className="footer-text">Wallet</p>
</Link>

      </div>
    </div>
  );
}
