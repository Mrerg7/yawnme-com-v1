type FeedMsg = [string, string];

const feedMessages: FeedMsg[] = [
  ['Sarah in Phoenix', 'caught a yawn from her partner'],
  ['Marcus in London', 'yawned after seeing his dog stretch'],
  ['Priya in Mumbai', 'yawned during a video call with her sister'],
  ['Lucas in São Paulo', 'matched his colleague’s yawn in a meeting'],
  ['Elena in Madrid', 'yawned after hearing her mom on the phone'],
  ['Jamal in Nairobi', 'caught it from his best friend'],
  ['Sophie in Vancouver', 'yawned watching a sleepy video'],
  ['Kenji in Tokyo', 'responded to his cat’s big yawn'],
  ['Aisha in Dubai', 'yawned in solidarity with her team'],
];

const quizData = [
  {
    q: 'When someone close to you yawns, how often do you yawn too?',
    opts: ['Almost always', 'Frequently', 'Sometimes', 'Rarely'],
  },
  {
    q: 'Do you yawn more around friends/family than when alone?',
    opts: ['Much more socially', 'Slightly more', 'About the same', 'Less around others'],
  },
  {
    q: 'How easily do you sense what others are feeling emotionally?',
    opts: ['Very easily', 'Quite easily', 'Average', 'Not very easily'],
  },
  {
    q: 'Have you ever yawned after just hearing someone yawn?',
    opts: ['Yes, often', 'Yes, sometimes', 'Once or twice', 'Never'],
  },
  {
    q: 'Do emotional scenes in movies or shows make you physically react?',
    opts: ['Very frequently', 'Often', 'Sometimes', 'Rarely'],
  },
];

let globalYawns = 142891;
let sessionYawns = 0;
let quizStep = 0;
let quizScore = 0;
let audioCtx: AudioContext | undefined;

function updateCounters() {
  const g = document.getElementById('global-yawns');
  const s = document.getElementById('session-yawns');
  if (g) g.textContent = globalYawns.toLocaleString();
  if (s) s.textContent = String(sessionYawns);
}

function incrementGlobal(n = 1) {
  globalYawns += n;
  const el = document.getElementById('global-yawns');
  if (el) {
    el.textContent = globalYawns.toLocaleString();
    el.style.transition = 'color 300ms ease';
    el.style.color = '#0d7377';
    setTimeout(() => {
      el.style.color = '';
    }, 650);
  }
}

function incrementSession() {
  sessionYawns++;
  const el = document.getElementById('session-yawns');
  if (el) {
    el.textContent = String(sessionYawns);
    el.style.transform = 'scale(1.25)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 180);
  }
  if (Math.random() < 0.4) setTimeout(() => incrementGlobal(1), 900);
}

function createParticles(parent: HTMLElement, count = 8) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'contagion-particle';
    p.style.left = `${35 + Math.random() * 30}%`;
    p.style.top = `${48 + Math.random() * 28}%`;
    p.style.opacity = String(0.6 + Math.random() * 0.35);
    parent.appendChild(p);

    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 55 + Math.random() * 75;
      p.style.transition = 'transform 920ms ease-out, opacity 920ms ease-out';
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 30}px)`;
      p.style.opacity = '0';
      setTimeout(() => p.remove(), 950);
    }, 30);
  }
}

function playSoftYawnTone() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) audioCtx = new AC();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 88;
    filter.type = 'lowpass';
    filter.frequency.value = 340;
    gain.gain.value = 0.028;

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.028, now);
    gain.gain.linearRampToValueAtTime(0.0005, now + 1.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.9);
  } catch {
    /* ignore audio failures */
  }
}

function addYawnToFeed(who: string | null = null, isUser = false) {
  const feed = document.getElementById('yawn-feed');
  if (!feed) return;

  const msg: FeedMsg = isUser
    ? ['You', 'just triggered a contagious yawn']
    : feedMessages[Math.floor(Math.random() * feedMessages.length)]!;

  const item = document.createElement('div');
  item.className = `yawn-feed-item flex items-center gap-x-3 px-4 py-[9px] rounded-2xl ${
    isUser ? 'bg-teal/10 border border-teal/25' : 'hover:bg-ink/5'
  }`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  item.innerHTML = `
    <div class="flex-shrink-0 w-2 h-2 rounded-full ${isUser ? 'bg-teal' : 'bg-coral'} mt-px"></div>
    <div class="flex-1 min-w-0 text-sm">
      <span class="font-medium ${isUser ? 'text-teal-deep' : 'text-ink'}">${msg[0]}</span>
      <span class="text-ink/50"> ${msg[1]}</span>
    </div>
    <div class="text-[10px] text-ink/40 font-mono flex-shrink-0">${timeStr}</div>
  `;

  feed.prepend(item);
  while (feed.children.length > 11) {
    feed.removeChild(feed.lastChild!);
  }
  if (!isUser) incrementGlobal(1);
}

function triggerHeroYawn(el: HTMLElement) {
  const mouth = document.getElementById('hero-mouth');
  const mouthInner = document.getElementById('hero-mouth-inner');
  const eyes = document.getElementById('hero-eyes');
  if (!mouth) return;

  el.classList.add('scale-[1.03]');
  mouth.style.transition = 'all 340ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  mouth.setAttribute('d', 'M105 176 Q160 218 215 176');

  if (mouthInner) {
    mouthInner.style.transition = 'all 340ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    mouthInner.setAttribute('d', 'M118 178 Q160 208 202 178');
  }
  if (eyes) {
    eyes.style.transition = 'all 220ms ease';
    eyes.setAttribute('transform', 'translate(0, 5)');
  }

  createParticles(el, 11);
  playSoftYawnTone();
  incrementSession();
  incrementGlobal(1);
  addYawnToFeed('You', true);

  setTimeout(() => {
    mouth.style.transition = 'all 680ms cubic-bezier(0.23, 1, 0.32, 1)';
    mouth.setAttribute('d', 'M112 183 Q160 194 208 183');
    if (mouthInner) mouthInner.setAttribute('d', 'M124 181 Q160 189 196 181');
    if (eyes) eyes.setAttribute('transform', 'translate(0, 0)');
    el.classList.remove('scale-[1.03]');
  }, 1350);
}

function triggerMainYawn(el?: HTMLElement | null) {
  const container =
    el || (document.getElementById('main-yawn-container') as HTMLElement | null);
  const mouth = document.getElementById('main-mouth');
  const eyes = document.getElementById('main-eyes');
  const status = document.getElementById('main-status');
  const countEl = document.getElementById('main-count');
  if (!mouth || !container) return;

  container.style.transform = 'scale(0.985)';
  mouth.style.transition = 'all 260ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  mouth.setAttribute('d', 'M70 152 Q130 175 190 152');

  if (eyes) {
    eyes.style.transition = 'all 180ms ease';
    eyes.setAttribute('transform', 'translate(0, 4)');
  }

  createParticles(container, 8);
  playSoftYawnTone();
  incrementSession();
  incrementGlobal(1);
  addYawnToFeed('You', true);

  if (status) {
    const msgs = [
      'Mirror neurons activated',
      'Empathy simulation complete',
      'Contagion successful',
      'You caught that yawn',
    ];
    status.textContent = msgs[Math.floor(Math.random() * msgs.length)]!;
    status.classList.add('text-teal');
  }

  const current = parseInt(countEl?.querySelector('span')?.textContent || '0', 10);
  if (countEl) {
    countEl.innerHTML = `Yawns triggered this session: <span class="font-semibold">${current + 1}</span>`;
  }

  setTimeout(() => {
    mouth.style.transition = 'all 720ms cubic-bezier(0.23, 1, 0.32, 1)';
    mouth.setAttribute('d', 'M78 148 Q130 160 182 148');
    if (eyes) eyes.setAttribute('transform', 'translate(0, 0)');
    container.style.transform = 'scale(1)';
    if (status) {
      status.classList.remove('text-teal');
      status.textContent = 'Your brain is ready to simulate a yawn...';
    }
  }, 1450);
}

function seedFeed() {
  const feed = document.getElementById('yawn-feed');
  if (!feed) return;

  for (let i = 0; i < 5; i++) {
    const msg = feedMessages[Math.floor(Math.random() * feedMessages.length)]!;
    const item = document.createElement('div');
    item.className = 'flex items-center gap-x-3 px-4 py-[9px] rounded-2xl hover:bg-ink/5';
    const minutesAgo = Math.floor(Math.random() * 18) + 2;
    item.innerHTML = `
      <div class="flex-shrink-0 w-2 h-2 rounded-full bg-coral mt-px"></div>
      <div class="flex-1 min-w-0 text-sm">
        <span class="font-medium text-ink">${msg[0]}</span>
        <span class="text-ink/50"> ${msg[1]}</span>
      </div>
      <div class="text-[10px] text-ink/40 font-mono flex-shrink-0">${minutesAgo}m ago</div>
    `;
    feed.appendChild(item);
  }

  setInterval(() => {
    if (document.visibilityState === 'visible' && Math.random() < 0.55) {
      addYawnToFeed();
    }
  }, 12500);
}

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function launchConfetti() {
  const colors = ['#0d7377', '#c45c3e', '#c4a574'];
  for (let i = 0; i < 38; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;z-index:99999;width:6.5px;height:6.5px;border-radius:999px;pointer-events:none;left:${Math.random() * window.innerWidth}px;top:-12px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)]!;
    document.body.appendChild(p);

    const dur = 1700 + Math.random() * 1800;
    let start: number | null = null;

    function anim(ts: number) {
      if (!start) start = ts;
      const prog = (ts - start) / dur;
      if (prog < 1) {
        const y = prog * (window.innerHeight + 100);
        p.style.transform = `translate(${Math.sin(prog * 6) * 28}px, ${y}px)`;
        p.style.opacity = String(1 - prog * 0.85);
        requestAnimationFrame(anim);
      } else p.remove();
    }
    requestAnimationFrame(anim);
  }
}

function showQuizResult(container: HTMLElement) {
  const max = 20;
  const pct = Math.round((quizScore / max) * 100);

  let label = '';
  let desc = '';
  let color = '';

  if (pct >= 80) {
    label = 'Highly Susceptible';
    desc =
      'Your yawn reflex is very strong. This often reflects high empathic sensitivity and strong mirror neuron responsiveness.';
    color = 'text-teal';
  } else if (pct >= 62) {
    label = 'Moderately Susceptible';
    desc =
      'You have a solid contagious yawning response — typical of good social-emotional attunement.';
    color = 'text-sky';
  } else if (pct >= 42) {
    label = 'Average Response';
    desc =
      'Your results sit comfortably in the normal range. Many factors (fatigue, closeness, context) influence the response.';
    color = 'text-sand';
  } else {
    label = 'Lower Susceptibility';
    desc =
      'You may be less prone to catching yawns. This can relate to attention patterns or neurochemistry and does not imply low empathy.';
    color = 'text-coral';
  }

  container.innerHTML = `
    <div class="text-center py-3">
      <div class="text-xs tracking-widest text-teal mb-1 font-semibold">YOUR RESULT</div>
      <div class="${color} text-7xl font-display font-bold tracking-tighter mb-1">${pct}<span class="text-4xl align-super font-normal">%</span></div>
      <div class="text-2xl font-semibold tracking-tight mb-5">${label}</div>
      <p class="text-ink/65 text-[15px] max-w-[340px] mx-auto">${desc}</p>
      <div class="mt-8 flex flex-col gap-y-3">
        <button type="button" data-quiz-to-experience class="w-full h-12 rounded-2xl bg-teal hover:bg-teal-deep text-paper font-semibold transition-colors">Try the Yawn Experience</button>
        <button type="button" data-quiz-close class="w-full h-12 rounded-2xl border border-ink/15 hover:bg-ink/5 text-sm font-medium transition-colors">Close</button>
      </div>
    </div>
  `;

  container.querySelector('[data-quiz-to-experience]')?.addEventListener('click', () => {
    closeQuizModal();
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  });
  container.querySelector('[data-quiz-close]')?.addEventListener('click', closeQuizModal);

  if (pct >= 75) launchConfetti();
  incrementGlobal(2);
}

function selectQuizAnswer(index: number, el: HTMLElement) {
  quizScore += 4 - index;
  el.style.borderColor = '#0d7377';
  el.style.background = 'rgba(13, 115, 119, 0.12)';

  setTimeout(() => {
    quizStep++;
    const container = document.getElementById('quiz-content');
    if (container) renderQuizStep(container);
  }, 380);
}

function renderQuizStep(container: HTMLElement) {
  if (quizStep >= quizData.length) {
    showQuizResult(container);
    return;
  }

  const q = quizData[quizStep]!;
  container.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <div class="text-xs tracking-[1.5px] text-teal font-semibold">QUESTION ${quizStep + 1} / ${quizData.length}</div>
      <button type="button" data-quiz-close class="text-ink/40 hover:text-ink text-xl leading-none" aria-label="Close quiz">&times;</button>
    </div>
    <div class="text-xl font-semibold tracking-tight mb-7">${q.q}</div>
    <div class="space-y-2.5" data-quiz-opts></div>
  `;

  container.querySelector('[data-quiz-close]')?.addEventListener('click', closeQuizModal);

  const opts = container.querySelector('[data-quiz-opts]');
  q.opts.forEach((opt, i) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className =
      'w-full text-left cursor-pointer border border-ink/15 hover:border-ink/30 active:bg-ink/5 px-5 py-4 rounded-2xl text-[15px] flex justify-between items-center transition-colors';
    row.innerHTML = `<span>${opt}</span><span class="text-ink/30" aria-hidden="true">›</span>`;
    row.addEventListener('click', () => selectQuizAnswer(i, row));
    opts?.appendChild(row);
  });
}

function startQuickQuiz() {
  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-content');
  if (!modal || !content) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  quizStep = 0;
  quizScore = 0;
  renderQuizStep(content);
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 15);
  });
}

export function initYawnme() {
  initNavbar();
  updateCounters();
  seedFeed();

  document.querySelectorAll('[data-yawn-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => triggerMainYawn());
  });

  document.getElementById('hero-yawn')?.addEventListener('click', (e) => {
    triggerHeroYawn(e.currentTarget as HTMLElement);
  });

  document.getElementById('main-yawn-container')?.addEventListener('click', (e) => {
    triggerMainYawn(e.currentTarget as HTMLElement);
  });

  document.getElementById('add-yawn-feed')?.addEventListener('click', () => {
    addYawnToFeed('You', true);
    incrementSession();
  });

  document.getElementById('start-quiz')?.addEventListener('click', startQuickQuiz);

  document.getElementById('quiz-modal')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'quiz-modal') closeQuizModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'y') {
      const main = document.getElementById('main-yawn-container');
      if (main) triggerMainYawn(main);
    }
    if (e.key === '?') {
      document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  setInterval(() => {
    if (document.visibilityState === 'visible' && Math.random() < 0.22) {
      incrementGlobal(1);
    }
  }, 18500);

  (window as unknown as { YAWNME: { yawn: () => void; stats: () => object } }).YAWNME = {
    yawn: () => triggerMainYawn(),
    stats: () => ({ global: globalYawns, session: sessionYawns }),
  };
}
