// src/utils/playPanicSound.js

let panicAudio = null;

export const playPanicSound = () => {
  try {
    if (!panicAudio) {
      panicAudio = new Audio('/sounds/panic_alert.mp3');
      panicAudio.loop = true;
      panicAudio.volume = 1.0;
    }

    panicAudio.play();

    // Optional vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 300, 500]);
    }
  } catch (error) {
    console.error('🔇 Unable to play panic sound:', error);
  }
};

export const stopPanicSound = () => {
  try {
    if (panicAudio) {
      panicAudio.pause();
      panicAudio.currentTime = 0;
    }
    // Stop vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  } catch (error) {
    console.error('🔇 Unable to stop panic sound:', error);
  }
};