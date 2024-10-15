// LoadingComponent.tsx (Client Component)
"use client"; // Mark this as a Client Component

import { useState, useEffect } from 'react';

export default function LoadingComponent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a 5-second loading time
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    let counter = 0;
    const imageChangeInterval = setInterval(() => {
      if (counter === 3) {
        counter = 0;
      }
      changeImage(counter);
      counter++;
    }, 3000);

    return () => clearInterval(imageChangeInterval);
  }, []);

  const changeImage = (counter: number) => {
    const images = ['fa fa-gamepad', '/cool.png'];
    if (images[counter].startsWith('fa')) {
      document.querySelector('.loader .image')!.innerHTML = `<i class="${images[counter]}"></i>`;
    } else {
      document.querySelector('.loader .image')!.innerHTML = `<img src="${images[counter]}" alt="Cat icon">`;
    }
  };

  return loading ? (
    <div id="loading-container">
      <div className="loader">
        <div className="image">
          <img src="/cool.png" alt="Loading icon" />
        </div>
        <span>Loading...</span>
      </div>
    </div>
  ) : (
    <div id="home-container">
      <div className="bg-gradient-to-r from-blue-100 to-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/IMG_0113.jpeg" alt="Cat icon" className="mr-2" width="24" height="24" />
          <span>Check Our Latest Update!</span>
        </div>
        <button className="bg-white font-bold text-blue-600 px-4 py-2 rounded-full">Check</button>
      </div>
      {/* Add more of your homepage content here */}
    </div>
  );
}
