/**
 * Text-to-Speech utility using Web Speech API
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

// Ensure voices are loaded
export function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        resolve();
      };
    }
  });
}

export async function speakQuote(text: string, author: string, onEnd?: () => void): Promise<void> {
  try {
    // Ensure voices are loaded
    await ensureVoicesLoaded();

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const fullText = `${text}. By ${author}`;
    currentUtterance = new SpeechSynthesisUtterance(fullText);

    // Configure utterance
    currentUtterance.rate = 0.95; // Slightly slower for clarity
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log(`Available voices: ${voices.length}`);

    // Use the first available English voice
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      currentUtterance.voice = englishVoice;
      console.log(`Using voice: ${englishVoice.name}`);
    } else if (voices.length > 0) {
      // Fallback to first available voice
      currentUtterance.voice = voices[0];
      console.log(`Using fallback voice: ${voices[0].name}`);
    }

    // Add error handler
    currentUtterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    currentUtterance.onend = () => {
      console.log("Speech synthesis ended");
      if (onEnd) onEnd();
    };

    // Speak
    console.log("Starting speech synthesis");
    window.speechSynthesis.speak(currentUtterance);
  } catch (error) {
    console.error("Error in speakQuote:", error);
  }
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
