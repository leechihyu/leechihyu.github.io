// wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded');
  
  // get the DOM elements
  const textElement = document.getElementById('text');
  const translationsBox = document.getElementById('translations-box');
  
  // set the initial text box content
  translationsBox.innerHTML = 'click the highlighted word to see translations';
  
  // function to get the color of the word based on length/ratio
  function getColor(ratio) {
    // Ensure ratio is within 0-1 range
    ratio = Math.min(Math.max(ratio, 0), 1);
    const lightness = 90 - (ratio * 25);
    return `hsl(360, 85%, ${lightness}%)`;
  }
  
  // load both JSON files
  Promise.all([
    fetch('words.json').then(response => response.json()),
    fetch('words2.json').then(response => response.json())
  ])
    .then(([wordsData, words2Data]) => {
      console.log('loaded both JSON files');
      
      // Flatten the words.json structure for easier processing
      const allWords = {};
      wordsData.forEach(item => {
        // Each item in wordsData is an object with a single key (the word)
        const word = Object.keys(item)[0];
        if (word) {
          allWords[word] = item[word];
        }
      });
      
      console.log('Total unique words in words.json:', Object.keys(allWords).length);
      
      // Flatten words2.json for frequency data
      const frequencyMap = {};
      words2Data.forEach(item => {
        // Each item in words2Data is an object with a single key (the word)
        const word = Object.keys(item)[0];
        if (word && item[word]) {
          frequencyMap[word] = item[word];
        }
      });
      
      console.log('Words with frequency data:', Object.keys(frequencyMap).length);
      
      // Process all words to create a map with colors and sorted translations
      const wordMap = {};
      
      for (const [word, info] of Object.entries(allWords)) {
        if (!info || !info.trans) {
          console.warn(`Word "${word}" has invalid format in words.json`, info);
          continue;
        }
        
        // Calculate ratio from length if needed
        const lengthValue = info.length || 0;
        const ratio = info.ratio !== undefined ? info.ratio : (lengthValue > 0 ? lengthValue / 70 : 0.5);
        
        // Get frequency data for this word
        const frequencies = frequencyMap[word] || {};
        
        // Create sorted translations
        const sortedTranslations = [...info.trans]
          .filter(trans => trans && trans.trim()) // Filter out empty translations
          .map(trans => {
            // Get frequency or ratio for this translation
            const freqValue = frequencies[trans];
            
            return {
              text: trans,
              frequency: freqValue !== undefined ? freqValue : 0,
              displayFreq: freqValue !== undefined ? 
                (freqValue <= 1 ? Math.round(freqValue * 100) + '%' : freqValue) : 
                '0%'
            };
          })
          .sort((a, b) => (b.frequency || 0) - (a.frequency || 0)); // Higher frequency first
        
        wordMap[word] = {
          originalWord: word,
          length: lengthValue,
          ratio: ratio,
          color: getColor(ratio),
          translations: sortedTranslations
        };
      }
      
      // Find all words that appear in the paragraph
      const paragraphText = textElement.textContent;
      const wordsInText = Object.keys(wordMap).filter(word => 
        paragraphText.includes(word)
      );
      
      console.log('Words found in paragraph:', wordsInText.length);
      
      // Sort words by length (longest first) to ensure longer phrases are processed before their components
      // This ensures "全党" is processed before "党"
      const sortedWords = wordsInText.sort((a, b) => {
        // First by length (longer first)
        const lengthDiff = b.length - a.length;
        if (lengthDiff !== 0) return lengthDiff;
        
        // Then by ratio (higher first) for same-length words
        return wordMap[b].ratio - wordMap[a].ratio;
      });
      
      console.log('Sorted words (longest first):', sortedWords.slice(0, 10));
      
      // Create a temporary div to manipulate the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = textElement.innerHTML;
      
      // Function to safely escape text for use in regex
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      // Process all text nodes in the content
      function processTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent;
          let positions = [];
          
          // Find all occurrences of all words
          sortedWords.forEach(word => {
            const regex = new RegExp(escapeRegExp(word), 'g');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
              // Check if this position overlaps with any existing highlight
              const start = match.index;
              const end = start + word.length;
              const overlaps = positions.some(pos => 
                (start < pos.end && end > pos.start)
              );
              
              if (!overlaps) {
                positions.push({
                  word: word,
                  start: start,
                  end: end,
                  info: wordMap[word]
                });
              }
            }
          });
          
          // Sort positions by start index
          positions.sort((a, b) => a.start - b.start);
          
          // Replace the text with highlighted spans
          if (positions.length > 0) {
            let result = '';
            let lastIndex = 0;
            
            positions.forEach(pos => {
              // Add text before the current position
              result += text.substring(lastIndex, pos.start);
              
              // Add the highlighted span
              const wordInfo = pos.info;
              const translationsData = wordInfo.translations
                .map(t => `${t.text.replace(/"/g, '&quot;')}|||${t.frequency}|||${t.displayFreq}`)
                .join('<<<>>>');
              
              result += `<span class="highlighted-word" 
                style="background-color:${wordInfo.color}" 
                data-translations="${translationsData}"
                onclick="showTranslations(this)">${pos.word}</span>`;
              
              lastIndex = pos.end;
            });
            
            // Add any remaining text
            result += text.substring(lastIndex);
            
            // Replace the text node with the new content
            const tempNode = document.createElement('span');
            tempNode.innerHTML = result;
            
            const parentNode = node.parentNode;
            while (tempNode.firstChild) {
              parentNode.insertBefore(tempNode.firstChild, node);
            }
            parentNode.removeChild(node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip processing if this is already a highlighted word
          if (node.classList && node.classList.contains('highlighted-word')) {
            return;
          }
          
          // Process all child nodes
          const childNodes = Array.from(node.childNodes);
          childNodes.forEach(processTextContent);
        }
      }
      
      // Process all nodes in the content
      Array.from(tempDiv.childNodes).forEach(processTextContent);
      
      // Update the text element with the processed content
      textElement.innerHTML = tempDiv.innerHTML;
      
      // After updating, check for highlighted elements
      const highlightedCount = document.getElementsByClassName('highlighted-word').length;
      console.log('Number of highlighted words:', highlightedCount);
    })
    .catch(error => {
      console.error('loading error:', error);
      document.getElementById('error').style.display = 'block';
    });
});

// define a global function to show translations
function showTranslations(element) {
  console.log('clicked word:', element.textContent);
  
  // get the translations data
  const word = element.textContent;
  const translationsData = element.getAttribute('data-translations');
  
  // parse the translations with frequencies
  const translations = translationsData.split('<<<>>>').map(item => {
    const parts = item.split('|||');
    return {
      text: parts[0].trim(),
      frequency: parseFloat(parts[1] || 0),
      displayFreq: parts[2] || '0%'
    };
  });
  
  console.log('Found translations:', translations);
  
  // get the translations box
  const translationsBox = document.getElementById('translations-box');
  
  // create the HTML content - word title
  let html = `<strong style="font-size: 18px; display:block; margin-bottom:10px;">${word}</strong>`;
  html += '<hr style="margin: 5px 0 15px 0;">';
  
  // create the translation table with frequencies
  if (translations.length > 0 && translations[0].text) {
    html += `
      <table style="width:100%; border-collapse: collapse; margin-bottom:10px;">
        <thead>
          <tr>
            <th style="width:40px; text-align:center; padding:8px; border-bottom:2px solid #ddd;">#</th>
            <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Translation</th>
            <th style="width:80px; text-align:center; padding:8px; border-bottom:2px solid #ddd;">Ratio</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    translations.forEach((trans, index) => {
      if (trans.text) {
        const bgColor = index % 2 === 0 ? '#f8f8f8' : '#fff';
        html += `
          <tr style="background-color:${bgColor};">
            <td style="text-align:center; padding:8px; border-bottom:1px solid #eee;">${index + 1}</td>
            <td style="padding:8px; border-bottom:1px solid #eee;">${trans.text}</td>
            <td style="text-align:center; padding:8px; border-bottom:1px solid #eee;">${trans.displayFreq}</td>
          </tr>
        `;
      }
    });
    
    html += `
        </tbody>
      </table>
    `;
  } else {
    html += '<div>no translations available</div>';
  }
  
  // update the translations box
  translationsBox.innerHTML = html;
  
  // scroll to the translations box
  translationsBox.scrollIntoView({behavior: 'smooth'});
  
  console.log('translations displayed');
}
