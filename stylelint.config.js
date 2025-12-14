/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'no-descending-specificity': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'media-feature-range-notation': 'prefix',
  },
};
