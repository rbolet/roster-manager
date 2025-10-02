export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Adding or updating tests
        'chore',    // Build process or auxiliary tool changes
        'ci',       // CI/CD changes
        'revert',   // Revert previous commit
      ],
    ],
    'subject-case': [2, 'always', 'sentence-case'],
  },
};
