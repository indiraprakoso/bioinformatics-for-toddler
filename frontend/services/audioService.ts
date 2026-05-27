// Initialize AudioContext lazily to comply with browser autoplay policies
let audioCtx: AudioContext | null = null;

// State for toggles
let isSfxEnabled = true;

export const toggleSfx = (enabled: boolean) => {
    isSfxEnabled = enabled;
};

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

export const playPopSound = () => {
    if (!isSfxEnabled) return;

    try {
        const ctx = getAudioContext();
        
        // Resume context if it was suspended (often required by browsers)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 'Pop' sound characteristics
        oscillator.type = 'sine';
        
        // Start at a higher frequency and drop rapidly
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        // Volume envelope: start loud, fade out quickly
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
        console.warn("Audio playback failed:", error);
    }
};
