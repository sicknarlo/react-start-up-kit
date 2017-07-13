/* eslint-env node */

// Concatenates all mocha tests (*.spec.js) so they share common code via Webpack
const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// Require all source files for code coverage purposes.
const path = require('path');
const componentsContext = require.context('../src/', true, /\.js$/);
componentsContext.keys().filter(key => {
    const basename = path.basename(key);
    // Exclude mount files: they blow up tests :(
    if (basename === 'mount.js') return false;

    return true;
}).forEach(componentsContext);
