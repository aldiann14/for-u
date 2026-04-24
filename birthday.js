// --- Split text into animated words ---
document.querySelectorAll('.anim').forEach(el => {
  const text = el.textContent;
  el.textContent = '';
  const parts = text.split(/(\s+)/);
  let wi = 0;
  parts.forEach(p => {
    if (/^\s+$/.test(p)) {
      const s = document.createElement('span');
      s.className = 'space';
      s.innerHTML = '&nbsp;';
      el.appendChild(s);
    } else {
      const w = document.createElement('span');
      w.className = 'word';
      w.textContent = p;
      w.style.transitionDelay = (wi * 60) + 'ms';
      el.appendChild(w);
      wi++;
    }
  });
});

// --- Scroll trigger: photos ---
const photoObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
    else if (e.boundingClientRect.top > 0) e.target.classList.remove('in-view');
  });
}, { threshold: .25 });
document.querySelectorAll('.photo-wrap').forEach(p => photoObs.observe(p));

// --- Scroll trigger: text ---
const textObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const words = e.target.querySelectorAll('.word');
    if (e.isIntersecting) words.forEach(w => w.classList.add('show'));
    else if (e.boundingClientRect.top > 0) words.forEach(w => w.classList.remove('show'));
  });
}, { threshold: .35 });
document.querySelectorAll('.anim').forEach(t => textObs.observe(t));

// --- Audio autoplay + tap fallback ---
const audio = document.getElementById('bgm');
const btn   = document.getElementById('audioToggle');
const label = document.getElementById('audioLabel');
audio.volume = 0.45;

const tryPlay = async () => {
  try { await audio.play(); label.textContent = 'music on'; }
  catch { label.textContent = 'tap to play music'; }
};
tryPlay();

const onFirst = async () => {
  if (audio.paused) {
    try { await audio.play(); label.textContent = 'music on'; } catch {}
  }
};
window.addEventListener('pointerdown', onFirst, { once: true });
window.addEventListener('keydown',     onFirst, { once: true });

btn.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); label.textContent = 'music on'; } catch {}
  } else {
    audio.pause();
    label.textContent = 'music paused';
  }
});

// --- Claim button: silent submit + success modal ---
const claimBtn     = document.getElementById('claimBtn');
const claimForm    = document.getElementById('claimForm');
const claimSuccess = document.getElementById('claimSuccess');
const claimClose   = document.getElementById('claimClose');

const showClaimSuccess = () => {
  claimSuccess.classList.add('show');
  claimSuccess.setAttribute('aria-hidden', 'false');
};
const hideClaimSuccess = () => {
  claimSuccess.classList.remove('show');
  claimSuccess.setAttribute('aria-hidden', 'true');
};

claimBtn.addEventListener('click', () => {
  claimBtn.disabled = true;
  claimBtn.classList.add('is-loading');
  try { claimForm.submit(); } catch (_) {}
  setTimeout(() => {
    claimBtn.classList.remove('is-loading');
    claimBtn.disabled = false;
    showClaimSuccess();
  }, 600);
});

claimClose.addEventListener('click', hideClaimSuccess);
claimSuccess.addEventListener('click', (e) => {
  if (e.target === claimSuccess) hideClaimSuccess();
});