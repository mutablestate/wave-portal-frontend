export function normalizeWave({ waver, timestamp, message }) {
  return {
    address: waver,
    timestamp: parseInt(timestamp) * 1000,
    message,
  };
}

export function sortByTimestampAsc(normalizedWaves) {
  return normalizedWaves.sort((a, b) => b.timestamp - a.timestamp);
}
