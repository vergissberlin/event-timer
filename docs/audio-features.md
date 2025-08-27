# Audio Features

## Overview

The Event Timer PWA includes comprehensive audio feedback using the Web Audio API for dynamic sound generation. All sounds are generated programmatically for optimal performance and customization.

## Sound Types

### 1. Event Start Sound
**Trigger**: When an event begins
**Sound**: Dramatic sequence with sweep and chord
- **Sweep**: 200Hz → 800Hz over 0.5 seconds
- **Chord**: 400Hz, 600Hz, 800Hz square wave for 0.8 seconds
- **Volume**: 0.4 (loud for attention)

### 2. 1-Minute Warning
**Trigger**: 60 seconds before event end
**Sound**: Single warning tone
- **Frequency**: 800Hz sine wave
- **Duration**: 0.5 seconds
- **Volume**: 0.3
- **Visual**: Timer blinks red

### 3. Last 10 Seconds - EKG Beeps
**Trigger**: Each second during final countdown
**Sound**: EKG-like double beep pattern
- **Frequency**: 800Hz + (10 - seconds) × 50Hz (increases with urgency)
- **Pattern**: Double beep with 150ms gap
- **First Beep**: 0.1s duration, volume 0.4
- **Second Beep**: 0.1s duration, volume 0.32 (80% of first)
- **Waveform**: Square wave for sharp, medical-like sound
- **Speech**: "Noch 10 Sekunden" announcement at 10 seconds

### 4. Event End - Long Alarm Tone
**Trigger**: When timer reaches zero
**Sound**: Long descending alarm tone
- **Frequency**: 1000Hz → 200Hz over 3 seconds
- **Waveform**: Sawtooth for harsh, attention-grabbing sound
- **Volume**: 0.6 → 0.1 (loud start, fading out)
- **Duration**: 3 seconds

### 5. Event End - Warm Sequence
**Trigger**: 3 seconds after zero (after long alarm)
**Sound**: Gentle, warm completion sequence
- **First Tone**: 300Hz sine wave, 0.4s duration
- **Second Tone**: 350Hz sine wave, 0.4s duration (1.2s delay)
- **Third Tone**: 400Hz sine wave, 0.5s duration (2.4s delay)
- **Volume**: 0.25-0.3 (gentle, warm)

## Technical Implementation

### Web Audio API Usage
```typescript
// Example: EKG Beep Generation
private generateEKGBeep(seconds: number): void {
  const frequency = 800 + (10 - seconds) * 50;
  const duration = 0.1;
  const volume = 0.4;
  
  // Double beep pattern
  this.generateTone(frequency, duration, 'square', volume);
  setTimeout(() => {
    this.generateTone(frequency, duration, 'square', volume * 0.8);
  }, 150);
}
```

### Audio Context Management
- **Lazy Initialization**: AudioContext created on first use
- **User Interaction**: Context resumed on user interaction
- **Error Handling**: Graceful fallback for unsupported browsers
- **Performance**: Efficient oscillator and gain node management

### Frequency Calculations

#### EKG Beep Frequencies
| Seconds Remaining | Frequency (Hz) |
|-------------------|----------------|
| 10                | 800            |
| 9                 | 850            |
| 8                 | 900            |
| 7                 | 950            |
| 6                 | 1000           |
| 5                 | 1050           |
| 4                 | 1100           |
| 3                 | 1150           |
| 2                 | 1200           |
| 1                 | 1250           |

#### Long Alarm Tone
- **Start**: 1000Hz sawtooth wave
- **End**: 200Hz sawtooth wave
- **Transition**: Exponential ramp over 3 seconds

## Audio Settings

### Configuration
```json
{
  "audioEnabled": true,
  "speechEnabled": true
}
```

### Controls
- **Audio Toggle**: Enable/disable all sounds
- **Speech Toggle**: Enable/disable speech synthesis
- **Volume**: Automatic volume management for different contexts

## Browser Compatibility

### Supported Browsers
- **Chrome/Chromium**: Full Web Audio API support
- **Firefox**: Full Web Audio API support
- **Safari**: WebkitAudioContext support
- **Edge**: Full Web Audio API support

### Fallback Behavior
- **No Web Audio API**: Console warning, no sound
- **No Speech API**: Console warning, no speech
- **Audio Context Suspended**: Automatic resume on user interaction

## User Experience

### Attention Hierarchy
1. **Event Start**: Dramatic sound for immediate attention
2. **1-Minute Warning**: Clear warning tone
3. **Last 10 Seconds**: Urgent EKG pattern with increasing frequency
4. **Zero**: Long alarm for maximum attention
5. **Completion**: Gentle warm tones for satisfaction

### Accessibility
- **Visual Feedback**: Timer color changes and blinking
- **Speech Support**: German language announcements
- **Volume Control**: Automatic volume adjustment
- **Error Handling**: Graceful degradation for audio issues

## Customization

### Modifying Sound Parameters
```typescript
// Custom EKG frequency range
const frequency = 600 + (10 - seconds) * 100; // Lower base, wider range

// Custom alarm duration
const alarmDuration = 5.0; // 5 seconds instead of 3

// Custom volume levels
const volume = 0.6; // Louder beeps
```

### Adding New Sound Types
```typescript
public playCustomSound(): void {
  this.generateTone(440, 1.0, 'sine', 0.3); // A4 note for 1 second
}
```

## Performance Considerations

### Memory Management
- **Oscillator Cleanup**: Automatic cleanup after sound completion
- **Gain Node Reuse**: Efficient gain node management
- **Context Suspension**: Automatic suspension when not in use

### Timing Precision
- **requestAnimationFrame**: Smooth timer updates
- **setTimeout**: Precise sound timing
- **Audio Context Time**: Synchronized audio scheduling

## Troubleshooting

### Common Issues

#### No Sound
1. Check browser Web Audio API support
2. Verify audio is enabled in settings
3. Check for user interaction requirement
4. Inspect console for error messages

#### Delayed Sound
1. Audio context may be suspended
2. Check for browser autoplay policies
3. Ensure user interaction before audio

#### Poor Sound Quality
1. Check browser audio settings
2. Verify system volume
3. Check for audio driver issues

### Debug Mode
```typescript
// Enable debug logging
console.log('Audio Context State:', audioContext.state);
console.log('Sound Generation:', frequency, duration, volume);
```

## Future Enhancements

### Planned Features
- [ ] Custom sound themes
- [ ] Volume fade controls
- [ ] Sound effect library
- [ ] Audio visualization
- [ ] MIDI support for custom sounds

### Advanced Audio
- [ ] Spatial audio positioning
- [ ] 3D audio effects
- [ ] Audio compression
- [ ] Real-time audio processing
