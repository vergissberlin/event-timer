import { FaviconGenerator } from '../src/favicon';

describe('FaviconGenerator', () => {
  describe('generateSVG', () => {
    it('should generate SVG with timer icon', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('<svg');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('viewBox="0 0 32 32"');
      expect(svg).toContain('#3b82f6'); // primary color
      expect(svg).toContain('#1e40af'); // secondary color
      expect(svg).toContain('#60a5fa'); // accent color
      expect(svg).toContain('circle'); // timer icon elements
      expect(svg).toContain('line'); // timer hands
    });

    it('should handle different theme colors', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
      expect(svg).toContain('#0000ff');
    });

    it('should generate valid SVG structure', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      // Check for required SVG elements
      expect(svg).toMatch(/<svg[^>]*>/);
      expect(svg).toMatch(/<\/svg>/);
      expect(svg).toMatch(/<circle/);
      expect(svg).toMatch(/<line/);
    });
  });

  describe('SVG Content Validation', () => {
    it('should include timer icon elements', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      // Check for timer icon specific elements
      expect(svg).toContain('circle'); // Timer circle
      expect(svg).toContain('line'); // Timer hands
      expect(svg).toContain('stroke-width="2"'); // Stroke styling
    });

    it('should use correct viewBox dimensions', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('width="32"');
      expect(svg).toContain('height="32"');
      expect(svg).toContain('viewBox="0 0 32 32"');
    });
  });

  describe('Theme Color Integration', () => {
    it('should use primary color for main elements', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('fill="#ff0000"'); // Background circle
    });

    it('should use secondary color for accents', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('stroke="#00ff00"'); // Border
    });

    it('should use accent color for highlights', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('stroke="#0000ff"'); // Timer hands
    });
  });
});
