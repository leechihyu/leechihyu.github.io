// Convert a length value to a color intensity
// We'll use a single color (blue) with varying lightness
function getColor(lengthVal) {
    // Adjust the scale as needed
    let ratio = lengthVal / 70;  // 70 is roughly the maximum length in our data
    if (ratio > 1) ratio = 1;    // clamp maximum
    
    // Use HSL color space with fixed hue (blue = 210)
    // Saturation fixed at 85%
    // Lightness varies from 90% (very light) to 65% (darker)
    const lightness = 90 - (ratio * 25); // This makes longer translations darker
    return `hsl(210, 85%, ${lightness}%)`;
}

// Create and manage tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    document.body.appendChild(tooltip);
    return tooltip;
}

// Position the tooltip
function positionTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    tooltip.style.top = (rect.bottom + scrollTop + 5) + 'px';
    let left = rect.left + scrollLeft;
    
    // Ensure tooltip doesn't go off-screen
    const tooltipWidth = tooltip.offsetWidth;
    const viewportWidth = window.innerWidth;
    if (left + tooltipWidth > viewportWidth) {
        left = viewportWidth - tooltipWidth - 10;
    }
    
    tooltip.style.left = left + 'px';
}

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    // Build a dictionary of words sorted by length (longest first)
    const wordEntries = data
      .map(item => {
        const [word, info] = Object.entries(item)[0];
        return { 
          word, 
          length: info.length, 
          color: getColor(info.length),
          translations: info.trans 
        };
      })
      .sort((a, b) => b.word.length - a.word.length);

    const textElement = document.getElementById('text');
    let originalText = textElement.innerText;
    const tooltip = createTooltip();

    // Replace each word with its highlighted version
    wordEntries.forEach(({ word, color, translations }) => {
      const regExp = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      originalText = originalText.replace(
        regExp,
        `<span class="highlighted-word" style="background-color:${color}" data-translations="${translations.join('&#10;')}">${word}</span>`
      );
    });

    // Put the highlighted version back into the DOM
    textElement.innerHTML = originalText;

    // Add event listeners for all highlighted words
    document.querySelectorAll('.highlighted-word').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const translations = e.target.getAttribute('data-translations').split('\n');
        tooltip.innerHTML = translations.map((t, i) => `${i + 1}. ${t}`).join('<br>');
        tooltip.style.display = 'block';
        positionTooltip(tooltip, e.target);
      });

      element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  })
  .catch(err => {
    console.error('Error loading or processing words.json:', err);
    document.getElementById('error').style.display = 'block';
  });
  
