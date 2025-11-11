
console.log('Running tests...');

// Test 1: Check if package.json exists
const fs = require('fs');
if (fs.existsSync('package.json')) {
    console.log('✓ Test 1 passed: package.json exists');
} else {
    console.error('✗ Test 1 failed: package.json missing');
    process.exit(1);
}

// Test 2: Check if server.js exists
if (fs.existsSync('server.js')) {
    console.log('✓ Test 2 passed: server.js exists');
} else {
    console.error('✗ Test 2 failed: server.js missing');
    process.exit(1);
}

// Test 3: Validate package.json
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.name && pkg.version) {
        console.log('✓ Test 3 passed: package.json is valid');
    } else {
        throw new Error('Invalid package.json');
    }
} catch (error) {
    console.error('✗ Test 3 failed:', error.message);
    process.exit(1);
}

console.log('\n✅ All tests passed!');