import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRandomInt, texts } from './utils'; // Importing utility functions

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
  handleClaim3
}: HomeUIProps) {
  const [updateText, setUpdateText] = useState("Exciting updates are on the way, keep farming :)");

  useEffect(() => {
    let previousIndex = -1;

    const intervalId = setInterval(() => {
      let randomIndex;
      do {
        randomIndex = getRandomInt(0, texts.length - 1);
      } while (randomIndex === previousIndex);

      previousIndex = randomIndex;
      setUpdateText(texts[randomIndex]);
    }, 15000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-between min-h-screen">
      {/* Header */}
      <div className="bg-white w-full h-3/4 rounded-b-full flex flex-col items-center justify-center shadow-lg">
        <div className="bg-gray-300 w-24 h-24 rounded-full mb-4">
          <img alt="Profile" className="w-full h-full rounded-full object-cover" src="https://storage.googleapis.com/a1aa/image/YlpvEfbklKRiDi8LX5Rww5U3zZZwHEUfju1qUNknpEZ6e2OnA.jpg" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mb-12 mt-4">{user.points} PixelDogs</p>

        {/* Tasks Section */}
        <div className="bg-white w-10/12 pt-6 pb-6 px-12 rounded-lg flex flex-col items-center shadow-md mt-12">
          <div className="bg-gray-200 text-center py-2 rounded-full mb-4 w-2/3 mx-auto">
            <p className="font-bold text-gray-600">Daily Tasks..!</p>
          </div>

          {/* Button 1 */}
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 glow-pink-on-hover transition duration-300">
            <p className="text-gray-800">Follow Our Youtube!</p>
            <button
              onClick={() => {
                if (buttonStage1 === 'check') {
                  handleButtonClick1()
                } else if (buttonStage1 === 'claim') {
                  handleClaim1()
                }
              }}
              disabled={buttonStage1 === 'claimed' || isLoading}
              className={`bg-gray-300 text-gray-800 px-4 py-2 rounded-lg ${
                buttonStage1 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>

          {/* Button 2 */}
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 glow-green-on-hover transition duration-300">
            <p className="text-gray-800">Follow Our Twitter!</p>
            <button
              onClick={() => {
                if (buttonStage2 === 'check') {
                  handleButtonClick2();
                } else if (buttonStage2 === 'claim') {
                  handleClaim2();
                }
              }}
              disabled={buttonStage2 === 'claimed' || isLoading}
              className={`bg-gray-300 text-gray-800 px-4 py-2 rounded-lg ${
                buttonStage2 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>

          {/* Button 3 */}
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 glow-blue-on-hover transition duration-300">
            <p className="text-gray-800">Follow Our Telegram!</p>
            <button
              onClick={() => {
                if (buttonStage3 === 'check') {
                  handleButtonClick3();
                } else if (buttonStage3 === 'claim') {
                  handleClaim3();
                }
              }}
              disabled={buttonStage3 === 'claimed' || isLoading}
              className={`bg-gray-300 text-gray-800 px-4 py-2 rounded-lg ${
                buttonStage3 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>

      {/* Farm PixelDogs Button */}
      <button className="bg-gray-800 text-white w-10/12 p-8 rounded-full mt-8 mb-4 shadow-lg hover:bg-gray-900 transition duration-300">
        Farm PixelDogs...
      </button>

      {/* Update Text Section */}
      <p id="updateText" className="text-gray-700 text-center mb-4 fade-in text-sm">
        {updateText}
      </p>

      {/* Bottom Navigation */}
      <div className="bg-white w-full py-4 flex justify-around items-center shadow-t-lg">
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
