// app.worker.ts

/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  postMessage(data);
});

addEventListener('error', (error) => {
  console.error('Worker error:', error);
});

