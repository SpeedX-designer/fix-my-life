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

    // Configure utterance for dramatic, serious tone
    currentUtterance.rate = 0.75; // Much slower for dramatic effect
    currentUtterance.pitch = 0.8; // Slightly lower pitch for seriousness
    currentUtterance.volume = 1;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log(`Available voices: ${voices.length}`);

    // Prefer a deeper/more serious English voice
    let selectedVoice = voices.find((v) => 
      v.lang.startsWith("en") && (v.name.includes("male") || v.name.includes("deep") || v.name.includes("serious"))
    );
    
    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("en"));
    }
    
    // Last resort: use first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      currentUtterance.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name}`);
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
    console.log("Starting speech synthesis with dramatic tone");
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
