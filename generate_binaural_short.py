import numpy as np
from scipy.io import wavfile
import struct, os

def generate_binaural_beat(filename, base_freq, beat_freq, duration=60, sample_rate=22050):
    """Generate a loopable binaural beat — 60 seconds, lower sample rate to keep file small."""
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    left = np.sin(2 * np.pi * base_freq * t)
    right = np.sin(2 * np.pi * (base_freq + beat_freq) * t)
    
    # Gentle fade in/out (3 seconds)
    fade_samples = sample_rate * 3
    fade = np.ones(len(t))
    fade[:fade_samples] = np.linspace(0, 1, fade_samples)
    fade[-fade_samples:] = np.linspace(1, 0, fade_samples)
    
    left = (left * fade * 0.7 * 32767).astype(np.int16)
    right = (right * fade * 0.7 * 32767).astype(np.int16)
    
    stereo = np.stack([left, right], axis=1)
    wavfile.write(filename, sample_rate, stereo)
    size = os.path.getsize(filename)
    print(f"Generated {filename}: {size/1024/1024:.1f} MB")

generate_binaural_beat("healing_delta_2hz.wav", base_freq=200, beat_freq=2)
generate_binaural_beat("relaxation_theta_6hz.wav", base_freq=200, beat_freq=6)
generate_binaural_beat("focus_alpha_10hz.wav", base_freq=200, beat_freq=10)
generate_binaural_beat("sleep_delta_1hz.wav", base_freq=180, beat_freq=1)
generate_binaural_beat("stress_theta_4hz.wav", base_freq=200, beat_freq=4)

print("Done!")
