/**
 * Text-to-Speech utility using Web Speech API
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakQuote(text: string, author: string): void {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create new utterance
  const fullText = `${text}. By ${author}`;
  currentUtterance = new SpeechSynthesisUtterance(fullText);

  // Configure utterance
  currentUtterance.rate = 0.95; // Slightly slower for clarity
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;

  // Use the first available voice, preferring English
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith("en")
  );
  if (englishVoice) {
    currentUtterance.voice = englishVoice;
  }

  // Speak
  window.speechSynthesis.speak(currentUtterance);
}

export function stopSpeech(): void {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}

export function pauseResumeSpeech(): void {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  } else if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}
