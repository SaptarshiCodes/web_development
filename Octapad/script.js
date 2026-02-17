const pads = document.querySelectorAll('.pad');

const keyToSound = {
  a: 'pad1',
  s: 'pad2',
  d: 'pad3',
  f: 'pad4',
  g: 'pad5',
  h: 'pad6',
  j: 'pad7',
  k: 'pad8',
};

const soundSettings = {
  pad1: { frequency: 80, type: 'sine', decay: 0.28, pitchDrop: true }, // kick
  pad2: { frequency: 230, type: 'triangle', decay: 0.14, noise: true }, // snare
  pad3: { frequency: 4300, type: 'square', decay: 0.06 }, // closed hh
  pad4: { frequency: 2900, type: 'square', decay: 0.16, noise: true }, // open hh
  pad5: { frequency: 100, type: 'sine', decay: 0.25, pitchDrop: true }, // low tom
  pad6: { frequency: 132, type: 'sine', decay: 0.22, pitchDrop: true }, // mid tom
  pad7: { frequency: 170, type: 'sine', decay: 0.2, pitchDrop: true }, // high tom
  pad8: { frequency: 1950, type: 'sawtooth', decay: 0.42, noise: true }, // crash
};

let audioCtx;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
}

function playPad(note) {
  const settings = soundSettings[note];
  if (!settings) return;

  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = settings.type;
  osc.frequency.setValueAtTime(settings.frequency, now);

  if (settings.pitchDrop) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(42, settings.frequency / 2.8),
      now + settings.decay
    );
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.85, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.decay);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + settings.decay + 0.03);

  if (settings.noise) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.36, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + settings.decay);

    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + settings.decay);
  }
}

function animatePad(note) {
  const pad = [...pads].find((item) => item.dataset.note === note);
  if (!pad) return;

  pad.classList.remove('active');
  void pad.offsetWidth;
  pad.classList.add('active');

  window.setTimeout(() => {
    pad.classList.remove('active');
  }, 180);
}

function trigger(note) {
  playPad(note);
  animatePad(note);
}

pads.forEach((pad) => {
  const note = pad.dataset.note;
  pad.addEventListener('pointerdown', () => trigger(note));
});

window.addEventListener('keydown', (event) => {
  const note = keyToSound[event.key.toLowerCase()];
  if (note) {
    trigger(note);
  }
});
