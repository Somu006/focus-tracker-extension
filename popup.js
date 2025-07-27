const btn = document.getElementById('toggleBtn');
const statusText = document.getElementById('statusText');
const exportBtn = document.getElementById('exportBtn');

function updateUI(state) {
  btn.textContent = state === 'in' ? 'Set Out of Focus' : 'Set In Focus';
  statusText.textContent = `Status: ${state === 'in' ? '🟢 In Focus' : '🔴 Out of Focus'}`;
}

chrome.storage.local.get(['focusState', 'log'], (result) => {
  const state = result.focusState || 'out';
  updateUI(state);
});

btn.addEventListener('click', () => {
  chrome.storage.local.get(['focusState', 'log'], (result) => {
    const current = result.focusState === 'in' ? 'out' : 'in';
    const log = result.log || [];
    log.push({ state: current, time: new Date().toISOString() });

    chrome.storage.local.set({ focusState: current, log }, () => {
      updateUI(current);
    });
  });
});

exportBtn.addEventListener('click', () => {
  chrome.storage.local.get(['log'], (result) => {
    const data = result.log || [];
    const csv = data.map(entry => `${entry.time},${entry.state}`).join('\n');
    const blob = new Blob([`timestamp,state\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'focus_log.csv';
    a.click();
  });
});