export class FaviconGenerator {
  private static generateSVG(colors: { primary: string; secondary: string; accent: string }): string {
    return `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <!-- Background circle -->
        <circle cx="16" cy="16" r="15" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
        
        <!-- Timer icon -->
        <circle cx="16" cy="16" r="8" fill="none" stroke="${colors.accent}" stroke-width="2"/>
        
        <!-- Hour hand -->
        <line x1="16" y1="16" x2="16" y2="8" stroke="${colors.accent}" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Minute hand -->
        <line x1="16" y1="16" x2="20" y2="16" stroke="${colors.accent}" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Center dot -->
        <circle cx="16" cy="16" r="1" fill="${colors.accent}"/>
      </svg>
    `;
  }

  public static updateFavicon(colors: { primary: string; secondary: string; accent: string }): void {
    const svg = this.generateSVG(colors);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = url;
    document.head.appendChild(link);

    // Clean up URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  public static generatePNG(colors: { primary: string; secondary: string; accent: string }): Promise<string> {
    return new Promise((resolve) => {
      const svg = this.generateSVG(colors);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      canvas.width = 32;
      canvas.height = 32;

      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    });
  }
}
