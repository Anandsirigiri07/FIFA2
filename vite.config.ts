import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('@google')) return 'gemini';
          if (id.includes('lucide')) return 'icons';
          if (id.includes('react-dom') || 
              id.includes('react-router')) return 'vendor';
          if (id.includes('react')) return 'react';
        }
      }
    },
    chunkSizeWarningLimit: 300,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
