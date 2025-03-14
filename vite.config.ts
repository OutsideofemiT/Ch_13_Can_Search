import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '.',
  plugins: [react()],
  preview: {
    allowedHosts: ['candidate-search-ihmu.onrender.com'],
    host: true // This ensures the preview server binds to all network interfaces
  }
});
