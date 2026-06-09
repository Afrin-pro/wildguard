// Nav toggle for mobile
function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// Auto-dismiss flash messages
document.addEventListener('DOMContentLoaded', () => {
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach(f => setTimeout(() => f.style.opacity = '0', 3500));
});

// Avatar dropdown — click to open, click outside to close
function toggleDropdown(e) {
  e.stopPropagation();
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;
  const isOpen = dropdown.style.display === 'block';
  dropdown.style.display = isOpen ? 'none' : 'block';
}

// Close dropdown when clicking anywhere else
document.addEventListener('click', () => {
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown) dropdown.style.display = 'none';
});
