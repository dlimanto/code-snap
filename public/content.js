let lastHoveredElement = null;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'startSelection') {
    enableHoverSelection();
    sendResponse({ status: 'Selection mode enabled' });
  }
  return true;
});

const enableHoverSelection = () => {
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
  document.addEventListener('click', handleClick, { once: true });
};

const handleMouseOver = (event) => {
  const element = event.target;

  if (element !== document.body && element !== document.documentElement) {
    if (lastHoveredElement) {
      lastHoveredElement.style.outline = '';
    }

    element.style.borderRadius = '4px';
    element.style.outline = '1px solid red';
    lastHoveredElement = element;
  }
};

const handleMouseOut = (event) => {
  const el = event.target;

  if (el !== document.body && el !== document.documentElement) {
    el.style.outline = '';
    lastHoveredElement = null;
  }
};

const handleClick = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const element = event.target;
  const html = element.outerHTML;
  const styles = getComputedStyle(element);

  const cssText = [ ...styles ].reduce((acc, prop) => {
    acc += `${ prop }: ${ styles.getPropertyValue(prop) };\n`;
    
    return acc;
  }, '');

  chrome.storage.local.set({ selectedHTML: html, selectedCSS: cssText }, () => {
    console.log('Element HTML and CSS stored successfully.');
  });

  document.removeEventListener('mouseover', handleMouseOver);
  document.removeEventListener('mouseout', handleMouseOut);
  document.removeEventListener('click', handleClick);
};
