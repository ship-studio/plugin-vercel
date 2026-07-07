import { defineConfig } from 'vite';

export default defineConfig({
  // Use the classic createElement transform against the host's React global.
  // The previous automatic-runtime shim aliased `jsx` to `createElement`,
  // but jsx(type, props, KEY) !== createElement(type, props, ...CHILDREN) —
  // the key landed in the children slot, so every keyed element (e.g.
  // <option key={team.id}>{team.name}</option>) rendered its key as its text.
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'ShipReact.createElement',
    jsxFragment: 'ShipReact.Fragment',
    jsxInject: 'const ShipReact = window.__SHIPSTUDIO_REACT__;',
  },
  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: '__SHIPSTUDIO_REACT__',
          'react-dom': '__SHIPSTUDIO_REACT_DOM__',
        },
        // Map externals to window globals for Blob URL loading
        paths: {
          react: 'data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;',
          'react-dom': 'data:text/javascript,export default window.__SHIPSTUDIO_REACT_DOM__;',
        },
      },
    },
    minify: false,
  },
});
