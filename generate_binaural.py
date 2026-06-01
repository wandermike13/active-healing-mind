import numpy as np
from scipy.io import wavfile

def generate_binaural_beat(filename, base_freq, beat_freq, duration=300, sample_rate=44100):
    """
    Generate a binaural beat audio file.
    Left ear: base_freq Hz
    Right ear: base_freq + beat_freq Hz
    The brain perceives the difference as a beat at beat_freq Hz.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    # Left channel: base frequency
    left = np.sin(2 * np.pi * base_freq * t)
    
    # Right channel: base + beat frequency
    right = np.sin(2 * np.pi * (base_freq + beat_freq) * t)
    
    # Add gentle fade in/out (10 seconds each)
    fade_samples = sample_rate * 10
    fade_in = np.ones(len(t))
    fade_in[:fade_samples] = np.linspace(0, 1, fade_samples)
    fade_out = np.ones(len(t))
    fade_out[-fade_samples:] = np.linspace(1, 0, fade_samples)
    fade = fade_in * fade_out
    
    left = (left * fade * 0.7 * 32767).astype(np.int16)
    right = (right * fade * 0.7 * 32767).astype(np.int16)
    
    stereo = np.stack([left, right], axis=1)
    wavfile.write(filename, sample_rate, stereo)
    print(f"Generated {filename}")

# 1. Healing / Pain Relief — Delta waves (2 Hz) — deep restorative state
#    Base: 200 Hz, Beat: 2 Hz
generate_binaural_beat("/app/audio/healing_delta_2hz.wav", base_freq=200, beat_freq=2, duration=300)

# 2. Relaxation / Anxiety Relief — Theta waves (6 Hz) — meditative calm
#    Base: 200 Hz, Beat: 6 Hz
generate_binaural_beat("/app/audio/relaxation_theta_6hz.wav", base_freq=200, beat_freq=6, duration=300)

# 3. Focus / Alertness — Alpha waves (10 Hz) — calm focus
#    Base: 200 Hz, Beat: 10 Hz
generate_binaural_beat("/app/audio/focus_alpha_10hz.wav", base_freq=200, beat_freq=10, duration=300)

# 4. Sleep — Delta deep (1 Hz) — deepest rest
#    Base: 180 Hz, Beat: 1 Hz
generate_binaural_beat("/app/audio/sleep_delta_1hz.wav", base_freq=180, beat_freq=1, duration=300)

# 5. Stress Relief — Theta (4 Hz) — deep meditation
#    Base: 200 Hz, Beat: 4 Hz
generate_binaural_beat("/app/audio/stress_theta_4hz.wav", base_freq=200, beat_freq=4, duration=300)

print("\nAll files generated!")
import os
for f in os.listdir("/app/audio"):
    size = os.path.getsize(f"/app/audio/{f}")
    print(f"  {f}: {size/1024/1024:.1f} MB")
