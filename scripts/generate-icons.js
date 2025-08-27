const fs = require('fs');
const path = require('path');

// SVG Template für das Icon
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#grad1)" stroke="#60a5fa" stroke-width="8"/>
  
  <!-- Timer icon -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="white" stroke-width="12"/>
  
  <!-- Clock hands -->
  <line x1="256" y1="256" x2="256" y2="120" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <line x1="256" y1="256" x2="320" y2="256" stroke="white" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Center dot -->
  <circle cx="256" cy="256" r="8" fill="white"/>
  
  <!-- Event dots -->
  <circle cx="256" cy="80" r="12" fill="#ef4444"/>
  <circle cx="400" cy="256" r="12" fill="#10b981"/>
  <circle cx="256" cy="432" r="12" fill="#f59e0b"/>
</svg>
`;

// Icon sizes to generate
const iconSizes = [16, 32, 192, 512];

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // For now, create a simple placeholder
  // In a real implementation, you would use a library like sharp or canvas to convert SVG to PNG
  console.log(`Creating icon: ${iconPath}`);
  
  // Create a simple placeholder file (you'll need to replace these with actual PNG files)
  const placeholderContent = `# Placeholder for ${size}x${size} icon
# Replace this with actual PNG file
# You can use online tools to convert the SVG above to PNG`;
  
  fs.writeFileSync(iconPath, placeholderContent);
});

console.log('Icon generation complete!');
console.log('Note: Replace placeholder files with actual PNG icons');
console.log('You can use the SVG template above with online converters');
