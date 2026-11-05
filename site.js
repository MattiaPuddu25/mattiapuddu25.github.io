const navigation = document.getElementById('NavigationBar');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function markCurrentPage() {
  navigation?.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

markCurrentPage();
// Keep the embedded navigation usable when pages are opened directly from disk.
if (navigation && /^https?:$/.test(window.location.protocol)) {
  fetch('NavigationBar.html')
    .then(response => {
      if (!response.ok) throw new Error('Navigation unavailable');
      return response.text();
    })
    .then(html => {
      navigation.innerHTML = html;
      markCurrentPage();
    })
    .catch(() => { /* The page already contains the full navigation. */ });
}

const notesList = document.getElementById('notes-list');
if (notesList) {
  const entries = Array.from(notesList.querySelectorAll('.note-entry'));
  const search = document.getElementById('notes-search');
  const sort = document.getElementById('notes-sort');
  const status = document.getElementById('notes-status');
  const empty = document.getElementById('notes-empty');
  const searchText = new Map(entries.map(entry => [entry, entry.textContent.toLocaleLowerCase()]));

  function updateNotes() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    const ordered = [...entries];
    if (sort.value === 'newest') ordered.sort((a, b) => b.dataset.date.localeCompare(a.dataset.date));
    if (sort.value === 'oldest') ordered.sort((a, b) => a.dataset.date.localeCompare(b.dataset.date));
    if (sort.value === 'title') ordered.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    ordered.forEach(entry => {
      entry.hidden = !searchText.get(entry).includes(query);
      if (!entry.hidden) visible++;
      notesList.appendChild(entry);
    });
    status.textContent = `${visible} of ${entries.length} notes`;
    empty.hidden = visible !== 0;
  }

  search.addEventListener('input', updateNotes);
  sort.addEventListener('change', updateNotes);
  document.getElementById('notes-reset').addEventListener('click', () => {
    search.value = '';
    sort.value = 'original';
    updateNotes();
    search.focus();
  });
  updateNotes();
}
