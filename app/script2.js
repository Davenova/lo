import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const imageInterval = setInterval(() => {
      setCounter((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3000);

    let num = 0;
    const percentageInterval = setInterval(() => {
      if (num <= 100) {
        setPercentage(num);
        num++;
      } else {
        clearInterval(percentageInterval);
      }
    }, 50);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(imageInterval);
      clearInterval(percentageInterval);
    };
  }, []);

  const images = ['fa fa-gamepad', '/cool.png'];

  const changeImage = () => {
    return images[counter].startsWith('fa')
      ? <i className={images[counter]}></i>
      : <img src={images[counter]} alt="Loading icon" />;
  };

  return (
    <div>
      {loading ? (
        <div className="loader">
          <div className="image">{changeImage()}</div>
          <span>{percentage}%</span>
        </div>
      ) : (
        <div>
          {/* Home content */}
        </div>
      )}
    </div>
  );
}
