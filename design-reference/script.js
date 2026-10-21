const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'মেনু খুলুন'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });

function filterCourses(category) {
  document.querySelectorAll('[data-filter]').forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterCourses(button.dataset.filter)));
const recommendations = { beginner: 'আপনার শুরুটা হতে পারে A1 — ইতালিয়ান ভাষার হাতেখড়ি দিয়ে।', intermediate: 'A2 — দৈনন্দিন জীবনের ইতালিয়ান কোর্সটি আপনার জন্য উপযোগী হতে পারে।', speaking: 'কথা বলার অনুশীলনের জন্য ইতালিয়ান স্পিকিং প্র্যাকটিস দেখুন।' };
document.querySelectorAll('[data-level]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-level]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    const result = document.querySelector('#level-result');
    result.replaceChildren(document.createTextNode(recommendations[button.dataset.level] + ' এটি একটি প্রাথমিক পরামর্শ। '));
    const link = document.createElement('a'); link.href = '#courses'; link.textContent = 'কোর্সটি দেখুন ↗'; link.addEventListener('click', () => filterCourses(button.dataset.level)); result.append(link); result.hidden = false;
  });
});
document.querySelectorAll('[data-course]').forEach(link => link.addEventListener('click', () => { document.querySelector('#course').value = link.dataset.course; }));
document.querySelector('#inquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim(); const message = document.querySelector('#message').value.trim();
  if (!name || !message) { const input = document.querySelector(!name ? '#name' : '#message'); input.setCustomValidity('অনুগ্রহ করে তথ্য লিখুন।'); input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), { once: true }); return; }
  document.querySelector('#draft-text').textContent = `আমার নাম ${name}।\nআগ্রহের কোর্স: ${document.querySelector('#course').value}\n\n${message}`;
  document.querySelector('#draft-result').hidden = false; document.querySelector('#copy-status').textContent = '';
});
document.querySelector('#copy-draft').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(document.querySelector('#draft-text').textContent); document.querySelector('#copy-status').textContent = 'খসড়া কপি হয়েছে। এটি কোথাও পাঠানো হয়নি।'; }
  catch { document.querySelector('#copy-status').textContent = 'স্বয়ংক্রিয়ভাবে কপি করা যায়নি। লেখাটি নির্বাচন করে কপি করুন।'; }
});
let toastTimer;
function toast(message) { const status = document.querySelector('#audio-status'); status.textContent = message; status.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { status.hidden = true; }, 5000); }
document.querySelector('#pronounce').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) { toast('এই ব্রাউজারে উচ্চারণ শোনার সুবিধা নেই।'); return; }
  speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance('Ciao, come stai?'); speech.lang = 'it-IT'; speech.rate = 0.8;
  const voice = speechSynthesis.getVoices().find(item => item.lang.startsWith('it')); if (voice) speech.voice = voice;
  speech.onerror = () => toast('উচ্চারণ চালানো যায়নি। আপনার ডিভাইসে ইতালিয়ান ভয়েস প্রয়োজন হতে পারে।'); speechSynthesis.speak(speech);
});
document.querySelector('#year').textContent = new Date().getFullYear();
