const pages = [...document.querySelectorAll('.page')];
const bar = document.getElementById('bar');

let page = 0;
let beloved = 'Habiba';


// ======================================================
// PAGE CONTROL
// ======================================================

function show(i) {
  pages.forEach(p => p.classList.remove('active'));

  if (pages[i]) {
    pages[i].classList.add('active');
  }

  page = i;

  if (bar) {
    bar.style.width = (i / (pages.length - 1)) * 100 + '%';
  }

  if (i !== 3 && i !== 5) {
    setClimax(false);
    setRoseFocus(false);
  }

  if (i === 1) {
    type(
      'type1',
      'কিছু ভালো লাগা হঠাৎ করে প্রবলভাবে আসে না, বরং তোমাকে বারবার মনে করতে করতে ধীরে ধীরে নিশ্চিত হয়ে ওঠে।'
    );
  }
}


// ======================================================
// NEXT BUTTONS
// ======================================================

document.querySelectorAll('.next').forEach(b => {
  b.onclick = () => {
    show(+b.dataset.next);
  };
});


// ======================================================
// TOAST
// ======================================================

function toast(s) {
  const t = document.getElementById('toast');
  if (!t) return;

  t.textContent = s;
  t.classList.add('show');

  setTimeout(() => t.classList.remove('show'), 2200);
}


// ======================================================
// TYPING EFFECT
// ======================================================

function type(id, txt) {
  const el = document.getElementById(id);
  if (!el || el.dataset.done) return;

  el.dataset.done = '1';
  let n = 0;

  const tm = setInterval(() => {
    el.textContent = txt.slice(0, n);
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    n++;

    if (n > txt.length) {
      clearInterval(tm);
      el.textContent = txt;
    }
  }, 70);
}


// ======================================================
// LOADER
// ======================================================

let lp = 0;
const fill = document.getElementById('fill');
const lt = document.getElementById('loaderText');

const texts = [
  'তারার আলো, ফুলের পাপড়ি আর হৃদস্পন্দন সংগ্রহ করা হচ্ছে...',
  'মনের কথাগুলো একটি চিঠিতে ভাঁজ করে রাখা হচ্ছে...',
  'গোলাপটিকে ধীরে ধীরে ফুটিয়ে তোলা হচ্ছে...',
  'এই ভালোবাসার চিঠি প্রস্তুত।'
];

const ltm = setInterval(() => {
  lp += Math.random() * 16 + 8;

  if (lp >= 100) {
    lp = 100;
    clearInterval(ltm);

    const startBtn = document.getElementById('start');
    if (startBtn) {
      startBtn.style.display = 'inline-block';
    }
  }

  if (lt) {
    lt.textContent = texts[Math.min(3, Math.floor(lp / 28))];
  }

  if (fill) {
    fill.style.width = lp + '%';
  }
}, 420);


// ======================================================
// MUSIC SYSTEM
// ======================================================

const mb = document.getElementById('music');
const bgm = document.getElementById('bgm');

let on = false;


function updateMusicButton() {
  if (!mb) return;
  const span = mb.querySelector('span');
  if (!span) return;

  if (on) {
    mb.classList.add('on');
    span.textContent = 'গান বন্ধ করুন';
  } else {
    mb.classList.remove('on');
    span.textContent = 'গান চালু করুন';
  }
}


function startAudio() {
  if (!bgm) return;

  bgm.volume = 0.55;
  const promise = bgm.play();

  if (promise !== undefined) {
    promise
      .then(() => {
        on = true;
        updateMusicButton();
      })
      .catch(() => {
        on = false;
        updateMusicButton();
        console.log('Audio autoplay was blocked by the browser.');
      });
  } else {
    on = true;
    updateMusicButton();
  }
}


const startBtn = document.getElementById('start');

if (startBtn) {
  startBtn.onclick = () => {
    startAudio();
    show(1);
  };
}


if (mb) {
  mb.onclick = () => {
    if (!bgm) return;

    if (bgm.paused) {
      bgm.volume = 0.55;
      const promise = bgm.play();

      if (promise !== undefined) {
        promise
          .then(() => {
            on = true;
            updateMusicButton();
          })
          .catch(() => {
            toast('গান চালু করা যাচ্ছে না। আবার চাপুন।');
          });
      } else {
        on = true;
        updateMusicButton();
      }
    } else {
      bgm.pause();
      on = false;
      updateMusicButton();
    }
  };
}


if (bgm) {
  bgm.addEventListener('play', () => {
    on = true;
    updateMusicButton();
  });

  bgm.addEventListener('pause', () => {
    on = false;
    updateMusicButton();
  });

  bgm.addEventListener('ended', () => {
    bgm.currentTime = 0;
    const promise = bgm.play();
    if (promise !== undefined) {
      promise.catch(() => {});
    }
  });

  bgm.addEventListener('error', () => {
    console.log('Audio file could not be loaded.');
    toast('গানের ফাইলটি লোড করা যাচ্ছে না।');
  });
}


// ======================================================
// BACKGROUND STARS & CANVAS SETUP
// ======================================================

const st = document.getElementById('stars');
const sx = st.getContext('2d');

const pc = document.getElementById('particles');
const px = pc.getContext('2d');

const fc = document.getElementById('fireworks');
const fx = fc.getContext('2d');

const cc = document.getElementById('climax');
const cx = cc.getContext('2d');

const rc = document.getElementById('roseFx');
const rx = rc.getContext('2d');


let W, H, DPR;
let stars = [];
let parts = [];
let sparks = [];


function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;

  [st, pc, fc, cc, rc].forEach(c => {
    if (!c) return;
    c.width = W * DPR;
    c.height = H * DPR;
    c.style.width = W + 'px';
    c.style.height = H + 'px';
    c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
  });

  stars = Array.from({ length: Math.floor((W * H) / 5200) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.3,
    a: Math.random() * 0.6 + 0.25,
    vx: (Math.random() - 0.5) * 0.14,
    vy: (Math.random() - 0.5) * 0.14
  }));

  initParts();

  if (climaxOn) {
    initNebula();
  }
}

window.onresize = resize;


function drawStars() {
  sx.clearRect(0, 0, W, H);

  stars.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    sx.beginPath();
    sx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    sx.fillStyle = `rgba(255,255,255,${p.a})`;
    sx.fill();

    for (let j = i + 1; j < Math.min(i + 8, stars.length); j++) {
      const q = stars[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);

      if (d < 96) {
        sx.strokeStyle = `rgba(255,255,255,${(1 - d / 96) * 0.09})`;
        sx.beginPath();
        sx.moveTo(p.x, p.y);
        sx.lineTo(q.x, q.y);
        sx.stroke();
      }
    }
  });

  requestAnimationFrame(drawStars);
}


// ======================================================
// POINTER EFFECT
// ======================================================

window.addEventListener('pointermove', e => {
  for (let i = 0; i < 2; i++) {
    sparks.push({
      x: e.clientX + (Math.random() - 0.5) * 12,
      y: e.clientY + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2 + 1,
      life: 1,
      c: '255,126,182'
    });
  }
});

window.addEventListener('pointerdown', e => {
  burst(e.clientX, e.clientY, 32);
});


// ======================================================
// SHAPES & PARTICLES
// ======================================================

function heartPt(t, s) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );

  return {
    x: W / 2 + x * s,
    y: H / 2 + y * s
  };
}

function textPts(text) {
  const off = document.createElement('canvas');
  const c = off.getContext('2d');

  off.width = Math.min(980, W * 0.92);
  off.height = 280;

  c.fillStyle = '#fff';
  c.textAlign = 'center';
  c.textBaseline = 'middle';

  const fs = Math.min(
    118,
    Math.max(54, off.width / (Math.max(text.length, 4) * 0.9))
  );

  c.font = `900 ${fs}px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif`;
  c.fillText(text, off.width / 2, off.height / 2);

  const data = c.getImageData(0, 0, off.width, off.height).data;
  const pts = [];
  const step = Math.max(4, Math.floor(off.width / 150));

  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      if (data[(y * off.width + x) * 4 + 3] > 80) {
        pts.push({
          x: W / 2 - off.width / 2 + x,
          y: H / 2 - off.height / 2 + y
        });
      }
    }
  }

  return pts.length ? pts : [{ x: W / 2, y: H / 2 }];
}

function galaxyPts() {
  const pts = [];
  const base = Math.min(W, H);
  const cx = W / 2;
  const cy = H / 2;

  for (let arm = 0; arm < 4; arm++) {
    const offset = (arm * Math.PI) / 2;

    for (let i = 0; i < 210; i++) {
      const t = i / 32;
      const r = (i / 210) * base * 0.43;

      pts.push({
        x: cx + Math.cos(t + offset) * r * 1.38 + (Math.random() - 0.5) * 18,
        y: cy + Math.sin(t + offset) * r * 0.66 + (Math.random() - 0.5) * 18
      });
    }
  }

  for (let i = 0; i < 160; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * base * 0.42;

    pts.push({
      x: cx + Math.cos(a) * r * 1.22,
      y: cy + Math.sin(a) * r * 0.6
    });
  }

  return pts;
}

function rosePts() {
  const pts = [];
  const base = Math.min(W, H);
  const cx = W / 2;
  const cy = H / 2 - 8;
  const s = base / 420;

  for (let layer = 0; layer < 8; layer++) {
    const scale = (34 + layer * 19) * s;
    const k = 3 + (layer % 5);
    const n = 190;

    for (let i = 0; i < n; i++) {
      const t = (Math.PI * 2 * i) / n;
      const r = scale * (0.7 + 0.3 * Math.sin(k * t + layer * 0.58));

      pts.push({
        x: cx + Math.cos(t) * r * (1.08 - layer * 0.018),
        y: cy + Math.sin(t) * r * 0.74
      });
    }
  }

  for (let i = 0; i < 300; i++) {
    const t = i / 18;
    const r = i * 0.28 * s;

    pts.push({
      x: cx + Math.cos(t) * r,
      y: cy + Math.sin(t) * r * 0.76
    });
  }

  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = (Math.random() * 0.34 + 0.66) * base * 0.34;

    pts.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.66
    });
  }

  return pts;
}

function initParts() {
  parts = Array.from({ length: 620 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    tx: Math.random() * W,
    ty: Math.random() * H,
    ox: Math.random() * W,
    oy: Math.random() * H,
    r: Math.random() * 1.9 + 0.85,
    c:
      Math.random() < 0.62
        ? '255,126,182'
        : Math.random() < 0.5
        ? '255,217,142'
        : '183,232,255'
  }));
}

function setShape(shape) {
  let pts = [];

  if (shape === 'heart') {
    pts = parts.map(() =>
      heartPt(
        Math.random() * Math.PI * 2,
        (Math.min(W, H) / 38) * (0.75 + Math.random() * 0.34)
      )
    );
  } else if (shape === 'name') {
    pts = textPts(beloved);
  } else if (shape === 'love') {
    pts = textPts('LOVE');
  } else if (shape === 'galaxy') {
    pts = galaxyPts();
  } else if (shape === 'rose') {
    pts = rosePts();
  } else {
    pts = parts.map(p => ({ x: p.ox, y: p.oy }));
  }

  parts.forEach((p, i) => {
    const q = pts[i % pts.length];
    p.tx = q.x + (Math.random() - 0.5) * 4;
    p.ty = q.y + (Math.random() - 0.5) * 4;
  });
}

function drawParts() {
  px.clearRect(0, 0, W, H);

  if (page === 3 || page === 5) {
    parts.forEach(p => {
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;

      px.beginPath();
      px.arc(p.x, p.y, roseFocus ? p.r * 1.28 : p.r, 0, Math.PI * 2);
      px.fillStyle = `rgba(${p.c},${roseFocus ? 0.9 : 0.76})`;
      px.shadowBlur = roseFocus ? 24 : 14;
      px.shadowColor = `rgba(${p.c},.75)`;
      px.fill();
      px.shadowBlur = 0;
    });
  }

  requestAnimationFrame(drawParts);
}


// ======================================================
// ROMANTIC SEQUENCE & BUTTONS
// ======================================================

const nameBtn = document.getElementById('nameBtn');
if (nameBtn) nameBtn.style.display = 'none';

const answer = document.getElementById('answer');

if (answer) {
  answer.onclick = () => {
    const svg = document.getElementById('romanceSvg');
    const cap = document.getElementById('caption');

    setRoseFocus(false);
    setClimax(false);

    if (svg) svg.classList.remove('svg-animate');

    const seq = [
      ['heart', 'তারার আলো ধীরে ধীরে একটি হৃদয়ে পরিণত হচ্ছে'],
      ['name', `তারার আলোয় ${beloved} নামটি লেখা হচ্ছে`],
      ['love', 'ভালোবাসার শব্দটি ধীরে ধীরে তৈরি হচ্ছে'],
      ['scatter', 'ভালোবাসার শব্দটি ছড়িয়ে পড়ছে, আর রাতের আকাশে গ্যালাক্সি ছড়িয়ে যাচ্ছে'],
      ['svg', 'বিশাল চাঁদ উঠছে, গ্যালাক্সির ঘূর্ণি আর আলোয় ভরে উঠছে আকাশ'],
      ['rose', 'শেষে, চাঁদের আলোর সামনে গোলাপের মুকুট স্পষ্ট হয়ে ফুটে উঠছে']
    ];

    seq.forEach((it, i) => {
      setTimeout(() => {
        if (it[0] === 'svg') {
          setClimax(true);
          if (svg) svg.classList.add('svg-animate');
          if (cap) cap.textContent = it[1];

          burst(W / 2, H * 0.42, 170);
          setTimeout(() => burst(W * 0.22, H * 0.28, 90), 1000);
          setTimeout(() => burst(W * 0.78, H * 0.32, 90), 2100);
          setTimeout(() => burst(W * 0.5, H * 0.2, 120), 3200);
        } else {
          if (it[0] === 'galaxy') setClimax(true);

          setShape(it[0]);
          if (cap) cap.textContent = it[1];

          if (it[0] === 'rose') {
            setRoseFocus(true);
            setTimeout(() => {
              burst(W / 2, H / 2, 230);
              fireworks();
              setTimeout(fireworks, 1200);
            }, 1600);
          }
        }

        toast(it[1]);
      }, i * 3900);
    });
  };
}


// ======================================================
// CLIMAX NEBULA
// ======================================================

let climaxOn = false;
let nebulaDots = [];

function initNebula() {
  nebulaDots = Array.from({ length: 320 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: Math.random() * Math.min(W, H) * 0.43,
    z: Math.random() * 1 + 0.25,
    spin: (Math.random() - 0.5) * 0.003,
    hue:
      Math.random() < 0.45
        ? '255,126,182'
        : Math.random() < 0.7
        ? '255,217,142'
        : '148,226,255',
    size: Math.random() * 2.15 + 0.8
  }));
}

function setClimax(onValue) {
  climaxOn = onValue;
  document.body.classList.toggle('climax-on', onValue);
  cc.classList.toggle('show', onValue);

  if (onValue && !nebulaDots.length) {
    initNebula();
  }
}

function drawClimax() {
  cx.clearRect(0, 0, W, H);

  if (climaxOn) {
    cx.save();
    cx.translate(W / 2, H / 2);

    const time = performance.now() * 0.00035;

    for (const p of nebulaDots) {
      p.a += p.spin;

      const wave = Math.sin(time * 3 + p.r * 0.013) * 18;
      const x = Math.cos(p.a + time) * (p.r + wave) * 1.35;
      const y = Math.sin(p.a + time) * (p.r + wave) * 0.62;

      cx.beginPath();
      cx.arc(x, y, p.size * p.z, 0, Math.PI * 2);
      cx.fillStyle = `rgba(${p.hue},${0.18 + 0.42 * p.z})`;
      cx.shadowBlur = 22;
      cx.shadowColor = `rgba(${p.hue},.65)`;
      cx.fill();
    }

    const g = cx.createRadialGradient(0, 0, 20, 0, 0, Math.min(W, H) * 0.45);
    g.addColorStop(0, 'rgba(255,255,255,.20)');
    g.addColorStop(0.28, 'rgba(255,126,182,.14)');
    g.addColorStop(0.62, 'rgba(148,226,255,.08)');
    g.addColorStop(1, 'rgba(255,255,255,0)');

    cx.fillStyle = g;
    cx.beginPath();
    cx.ellipse(0, 0, Math.min(W, H) * 0.58, Math.min(W, H) * 0.34, 0, 0, Math.PI * 2);
    cx.fill();

    cx.restore();
  }

  requestAnimationFrame(drawClimax);
}


// ======================================================
// ROSE FOCUS
// ======================================================

let roseFocus = false;
let roseDust = [];

function setRoseFocus(onValue) {
  roseFocus = onValue;
  document.body.classList.toggle('rose-focus', onValue);
  rc.classList.toggle('show', onValue);

  if (onValue) {
    initRoseDust();
  }
}

function initRoseDust() {
  roseDust = Array.from({ length: 190 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: Math.random() * Math.min(W, H) * 0.32,
    z: Math.random() * 1 + 0.3,
    sp: (Math.random() - 0.5) * 0.006,
    size: Math.random() * 2.15 + 0.8,
    c:
      Math.random() < 0.58
        ? '255,126,182'
        : Math.random() < 0.82
        ? '255,217,142'
        : '255,255,255'
  }));
}

function drawRoseFx() {
  rx.clearRect(0, 0, W, H);

  if (roseFocus) {
    const cx0 = W / 2;
    const cy0 = H / 2 - 8;

    const dg = rx.createRadialGradient(
      cx0,
      cy0,
      40,
      cx0,
      cy0,
      Math.min(W, H) * 0.48
    );
    dg.addColorStop(0, 'rgba(0,0,0,.00)');
    dg.addColorStop(0.34, 'rgba(0,0,0,.06)');
    dg.addColorStop(0.86, 'rgba(0,0,0,.00)');

    rx.fillStyle = dg;
    rx.fillRect(0, 0, W, H);

    const g = rx.createRadialGradient(
      cx0,
      cy0,
      10,
      cx0,
      cy0,
      Math.min(W, H) * 0.34
    );
    g.addColorStop(0, 'rgba(255,255,255,.42)');
    g.addColorStop(0.2, 'rgba(255,126,182,.28)');
    g.addColorStop(0.48, 'rgba(255,217,142,.12)');
    g.addColorStop(1, 'rgba(255,126,182,0)');

    rx.fillStyle = g;
    rx.beginPath();
    rx.ellipse(cx0, cy0, Math.min(W, H) * 0.4, Math.min(W, H) * 0.3, 0, 0, Math.PI * 2);
    rx.fill();

    const t = performance.now() * 0.0006;

    for (const p of roseDust) {
      p.a += p.sp;
      const wave = Math.sin(t * 4 + p.r * 0.02) * 10;
      const x = cx0 + Math.cos(p.a + t * 0.35) * (p.r + wave);
      const y = cy0 + Math.sin(p.a + t * 0.35) * (p.r + wave) * 0.68;

      rx.beginPath();
      rx.arc(x, y, p.size * p.z, 0, Math.PI * 2);
      rx.fillStyle = `rgba(${p.c},${0.22 + 0.45 * p.z})`;
      rx.shadowBlur = 24;
      rx.shadowColor = `rgba(${p.c},.75)`;
      rx.fill();
      rx.shadowBlur = 0;
    }
  }

  requestAnimationFrame(drawRoseFx);
}


// ======================================================
// FIREWORKS (CORRECTED BUG)
// ======================================================

function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = Math.random() * 5 + 1.5;

    sparks.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: Math.random() * 2.5 + 1,
      life: 1,
      c:
        Math.random() < 0.55
          ? '255,126,182'
          : Math.random() < 0.5
          ? '255,217,142'
          : '183,232,255'
    });
  }
}

function fireworks() {
  for (let k = 0; k < 5; k++) {
    setTimeout(
      () =>
        burst(
          Math.random() * W * 0.8 + W * 0.1,
          Math.random() * H * 0.45 + H * 0.12,
          86
        ),
      k * 480
    );
  }
}

// FIX: Reverse loop implemented to safely handle splice
function drawFx() {
  fx.clearRect(0, 0, W, H);

  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];

    p.life -= 0.018;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.025;

    fx.beginPath();
    fx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    fx.fillStyle = `rgba(${p.c},${Math.max(0, p.life)})`;
    fx.fill();

    if (p.life <= 0) {
      sparks.splice(i, 1);
    }
  }

  requestAnimationFrame(drawFx);
}


// ======================================================
// YES / WAIT / AGAIN BUTTONS
// ======================================================

const yes = document.getElementById('yes');
if (yes) {
  yes.onclick = () => {
    show(5);
    setRoseFocus(true);
    setShape('rose');
    fireworks();
  };
}

const wait = document.getElementById('wait');
if (wait) {
  wait.onclick = () => {
    toast('কোনো সমস্যা নেই, আমি তোমাকে তাড়া দেব না। শুধু মন থেকে কথাটা বলতে চেয়েছিলাম।');
    burst(W / 2, H * 0.68, 70);
  };
}

const again = document.getElementById('again');
if (again) {
  again.onclick = fireworks;
}


// ======================================================
// FALLING PETALS
// ======================================================

function petal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.setProperty('--dx', Math.random() * 180 - 90 + 'px');
  p.style.animationDuration = 8 + Math.random() * 8 + 's';
  p.style.opacity = 0.45 + Math.random() * 0.45;

  document.body.appendChild(p);

  setTimeout(() => p.remove(), 17000);
}

setInterval(petal, 520);


// ======================================================
// INITIALIZATION
// ======================================================

resize();
drawStars();
drawParts();
drawFx();
drawClimax();
drawRoseFx();
