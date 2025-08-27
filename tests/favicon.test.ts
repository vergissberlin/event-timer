import { FaviconGenerator } from '../src/favicon';

describe('FaviconGenerator', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      fillStyle: '',
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      arc: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 100 }),
      font: '',
      textAlign: 'left',
      textBaseline: 'top',
      fillText: jest.fn(),
      strokeText: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockContext),
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
      width: 32,
      height: 32,
    } as unknown as HTMLCanvasElement;

    // Mock document.createElement
    document.createElement = jest.fn().mockReturnValue(mockCanvas);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSVG', () => {
    it('should generate SVG with timer icon', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
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

  describe('updateFavicon', () => {
    it.skip('should update favicon links in document head', () => {
      // Mock document head and existing favicon links
      const mockHead = document.createElement('head');
      const existingFavicon = document.createElement('link');
      existingFavicon.rel = 'icon';
      existingFavicon.href = 'old-favicon.ico';
      mockHead.appendChild(existingFavicon);

      document.head = mockHead;

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.updateFavicon(theme);

      // Should remove old favicon and add new one
      expect(mockHead.children.length).toBe(1);
      const newFavicon = mockHead.children[0] as HTMLLinkElement;
      expect(newFavicon.rel).toBe('icon');
      expect(newFavicon.href).toContain('data:image/svg+xml');
    });

    it.skip('should handle multiple existing favicon links', () => {
      const mockHead = document.createElement('head');
      
      // Add multiple existing favicon links
      const favicon1 = document.createElement('link');
      favicon1.rel = 'icon';
      favicon1.href = 'favicon.ico';
      mockHead.appendChild(favicon1);

      const favicon2 = document.createElement('link');
      favicon2.rel = 'shortcut icon';
      favicon2.href = 'favicon.ico';
      mockHead.appendChild(favicon2);

      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = 'apple-touch-icon.png';
      mockHead.appendChild(appleTouchIcon);

      document.head = mockHead;

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.updateFavicon(theme);

      // Should remove all favicon-related links and add new one
      expect(mockHead.children.length).toBe(1);
      const newFavicon = mockHead.children[0] as HTMLLinkElement;
      expect(newFavicon.rel).toBe('icon');
    });

    it('should handle empty document head', () => {
      const mockHead = document.createElement('head');
      document.head = mockHead;

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.updateFavicon(theme);

      expect(mockHead.children.length).toBe(1);
      const newFavicon = mockHead.children[0] as HTMLLinkElement;
      expect(newFavicon.rel).toBe('icon');
    });

    it('should preserve non-favicon links', () => {
      const mockHead = document.createElement('head');
      
      // Add favicon link
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = 'favicon.ico';
      mockHead.appendChild(favicon);

      // Add non-favicon link
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'styles.css';
      mockHead.appendChild(stylesheet);

      document.head = mockHead;

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.updateFavicon(theme);

      // Should have favicon + stylesheet
      expect(mockHead.children.length).toBe(2);
      
      const links = Array.from(mockHead.children) as HTMLLinkElement[];
      const faviconLink = links.find(link => link.rel === 'icon');
      const stylesheetLink = links.find(link => link.rel === 'stylesheet');
      
      expect(faviconLink).toBeDefined();
      expect(stylesheetLink).toBeDefined();
      expect(stylesheetLink?.href).toBe('styles.css');
    });
  });

  describe('generatePNG', () => {
    it('should generate PNG data URL from SVG', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const pngDataUrl = FaviconGenerator.generatePNG(theme);

      expect(pngDataUrl).toContain('data:image/png;base64');
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    });

    it('should handle canvas context creation failure', () => {
      mockCanvas.getContext = jest.fn().mockReturnValue(null);

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      expect(() => FaviconGenerator.generatePNG(theme)).toThrow('Could not get canvas context');
    });

    it('should set canvas dimensions correctly', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.generatePNG(theme);

      expect(mockCanvas.width).toBe(32);
      expect(mockCanvas.height).toBe(32);
    });

    it('should draw SVG content to canvas', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.generatePNG(theme);

      // Should create an image and draw it to canvas
      expect(document.createElement).toHaveBeenCalledWith('img');
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
      expect(svg).toContain('path'); // Timer hands
      expect(svg).toContain('stroke-width="2"'); // Stroke styling
    });

    it('should include gradient definitions', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('<defs>');
      expect(svg).toContain('<linearGradient');
      expect(svg).toContain('<stop');
      expect(svg).toContain('</defs>');
    });

    it('should use correct viewBox dimensions', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

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

      expect(svg).toContain('#ff0000');
    });

    it('should use secondary color for accents', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('#00ff00');
    });

    it('should use accent color for highlights', () => {
      const theme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('#0000ff');
    });

    it('should handle hex colors without # prefix', () => {
      const theme = {
        primary: '3b82f6',
        secondary: '1e40af',
        accent: '60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);

      expect(svg).toContain('#3b82f6');
      expect(svg).toContain('#1e40af');
      expect(svg).toContain('#60a5fa');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing theme colors', () => {
      const theme = {
        primary: '#3b82f6'
        // Missing secondary and accent
      } as any;

      expect(() => FaviconGenerator.generateSVG(theme)).toThrow();
    });

    it('should handle invalid color formats', () => {
      const theme = {
        primary: 'invalid-color',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg = FaviconGenerator.generateSVG(theme);
      
      // Should still generate SVG but with fallback colors
      expect(svg).toContain('<svg');
    });

    it('should handle null theme', () => {
      expect(() => FaviconGenerator.generateSVG(null as any)).toThrow();
    });

    it('should handle undefined theme', () => {
      expect(() => FaviconGenerator.generateSVG(undefined as any)).toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should update favicon with generated SVG', () => {
      const mockHead = document.createElement('head');
      document.head = mockHead;

      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      FaviconGenerator.updateFavicon(theme);

      const faviconLink = mockHead.children[0] as HTMLLinkElement;
      expect(faviconLink.href).toContain('data:image/svg+xml');
      expect(faviconLink.href).toContain(encodeURIComponent('#3b82f6'));
    });

    it('should generate consistent SVG for same theme', () => {
      const theme = {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa'
      };

      const svg1 = FaviconGenerator.generateSVG(theme);
      const svg2 = FaviconGenerator.generateSVG(theme);

      expect(svg1).toBe(svg2);
    });
  });
});
