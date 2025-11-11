
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jenkins CI/CD Demo</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                h1 { color: #2c3e50; }
                .info { background: #3498db; color: white; padding: 20px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h1>🚀 Jenkins CI/CD Demo</h1>
            <div class="info">
                <h2>Application is running!</h2>
                <p>Built and deployed automatically by Jenkins</p>
                <p>Build: ${process.env.BUILD_NUMBER || 'local'}</p>
            </div>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});