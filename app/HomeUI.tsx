import Link from 'next/link';
import { useEffect } from 'react';

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
  useEffect(() => {
    toggleUpdateText(); // Call the function from the script
  }, []);

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function toggleUpdateText() {
    const updateTextElement = document.getElementById('updateText');
    const texts = [
      "Exciting updates are on the way, keep farming :)",
      "Stay healthy and stay alive for future events :)",
      "Join our socials for latest updates",
      "Only follow news shared in our official platforms",
      "You’re part of something special, stay connected for surprises!",
      "Big things are growing, keep your eyes on the field!",
      "Hold tight! The best surprises are worth the wait!",
      "Behind the scenes, we’re working on something you’ll love!"
    ];
    let previousIndex = -1;

    setInterval(() => {
      let randomIndex;
      do {
        randomIndex = getRandomInt(0, texts.length - 1);
      } while (randomIndex === previousIndex);

      previousIndex = randomIndex;

      if (updateTextElement) {
        updateTextElement.classList.remove('fade-in');
        updateTextElement.classList.add('fade-out');
        setTimeout(() => {
          updateTextElement.textContent = texts[randomIndex];
          updateTextElement.classList.remove('fade-out');
          updateTextElement.classList.add('fade-in');
        }, 1000);
      }
    }, 15000);
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-between min-h-screen">
      <div className="bg-gray-200 w-full h-1/2 rounded-b-full flex flex-col items-center justify-center shadow-lg">
        <div className="bg-gray-300 w-32 h-32 rounded-full shadow-md drag-down">
          <img alt="Animated style dog image" className="w-full h-full rounded-full object-cover" src="https://storage.googleapis.com/a1aa/image/YlpvEfbklKRiDi8LX5Rww5U3zZZwHEUfju1qUNknpEZ6e2OnA.jpg" />
        </div>
        <p className="text-gray-700 text-3xl mt-4 font-bold">{user.points} PixelDogs</p>
        <div className="bg-gray-100 w-3/4 mt-4 p-6 rounded-lg flex flex-col items-center shadow-md">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full mb-4 font-semibold shadow-sm hover:bg-gray-300 transition duration-300">Daily Tasks..!</button>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 shadow-sm glow-on-hover transition duration-300">
            <p className="text-gray-700 font-medium">Follow Our Youtube!</p>
            <button
              onClick={() => {
                if (buttonStage1 === 'check') {
                  handleButtonClick1();
                } else if (buttonStage1 === 'claim') {
                  handleClaim1();
                }
              }}
              disabled={buttonStage1 === 'claimed' || isLoading}
              className={`bg-gray-300 text-gray-700 px-4 py-1 rounded-full font-semibold shadow-sm hover:bg-gray-400 transition duration-300 ${
                buttonStage1 === 'claimed' || isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 shadow-sm glow-green-on-hover transition duration-300">
            <p className="text-gray-700 font-medium">Follow Our Twitter!</p>
            <button
              onClick={() => {
                handleButtonClick2();
                handleClaim2();
              }}
              disabled={buttonStage2 === 'claimed'}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full font-semibold shadow-sm hover:bg-gray-400 transition duration-300"
            >
              {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
          <div className="bg-gray-200 w-full p-4 rounded-lg flex justify-between items-center mb-4 shadow-sm glow-blue-on-hover transition duration-300">
            <p className="text-gray-700 font-medium">Join Our Telegram!</p>
            <button
              onClick={() => {
                handleButtonClick3();
                handleClaim3();
              }}
              disabled={buttonStage3 === 'claimed'}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full font-semibold shadow-sm hover:bg-gray-400 transition duration-300"
            >
              {buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
      <button className="bg-gray-800 text-white w-3/4 py-4 rounded-full mb-6 font-semibold text-lg shadow-sm hover:bg-gray-900 transition duration-300">Farm PixelDogs...</button>
      <p id="updateText" className="text-gray-700 text-center mb-4 fade fade-in text-sm">{notification}</p>
      <div className="bg-white w-full py-4 flex justify-around items-center shadow-t-lg">
        <Link href="/">
          <a className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition duration-300">
            <i className="fas fa-home text-2xl"></i>
            <p className="font-medium">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition duration-300">
            <i className="fas fa-users text-2xl"></i>
            <p className="font-medium">Friends</p>
          </a>
        </Link>
        <Link href="/wallet">
          <a className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition duration-300">
            <i className="fas fa-wallet text-2xl"></i>
            <p className="font-medium">Wallet</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
