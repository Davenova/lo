function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function toggleUpdateText() {
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

    updateTextElement.classList.remove('fade-in');
    updateTextElement.classList.add('fade-out');
    setTimeout(() => {
      updateTextElement.textContent = texts[randomIndex];
      updateTextElement.classList.remove('fade-out');
      updateTextElement.classList.add('fade-in');
    }, 1000);
  }, 10000);
}
