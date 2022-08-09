export function saveHistory(history) {
    localStorage.setItem('history', JSON.stringify(history));
}

export function loadHistory() {
    const stored = localStorage.getItem('history');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

