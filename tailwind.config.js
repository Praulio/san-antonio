export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)'
      }
    }
  },
  plugins: []
};
