const fs = require('fs');
const path = require('path');

describe('Sanitizer', () => {
  let sanitizeHTML;

  beforeAll(() => {
    const jsContent = fs.readFileSync(path.join(__dirname, 'i18n.js'), 'utf8');
    // Extract the function body.
    // We assume the function is defined as "function sanitizeHTML(str) { ... }"
    const match = jsContent.match(/function sanitizeHTML\(str\) \{([\s\S]*?)\n\s*\}/);
    if (!match) {
      throw new Error('Could not find sanitizeHTML function in i18n.js');
    }
    const functionBody = match[1];

    // Mock document.createElement for the function
    global.document = {
      createElement: () => ({
        set textContent(val) {
          // specific implementation for the test logic:
          // mimic browser behavior of escaping entities
          this._innerHTML = val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        },
        get innerHTML() {
          return this._innerHTML;
        },
      }),
    };

    // Create the function from the extracted body
    sanitizeHTML = new Function('str', functionBody);
  });

  test('should allow safe tags', () => {
    const input = 'Hello <b>world</b>';
    expect(sanitizeHTML(input)).toBe('Hello <b>world</b>');
  });

  test('should escape unsafe tags', () => {
    const input = 'Hello <script>alert(1)</script>';
    expect(sanitizeHTML(input)).toContain('&lt;script&gt;');
    expect(sanitizeHTML(input)).not.toContain('<script>');
  });

  test('should handle mixed content', () => {
    const input = '<b>Safe</b> and <img src=x onerror=alert(1)> unsafe';
    const output = sanitizeHTML(input);
    expect(output).toContain('<b>Safe</b>');
    expect(output).not.toContain('<img');
    expect(output).toContain('&lt;img');
  });
});
