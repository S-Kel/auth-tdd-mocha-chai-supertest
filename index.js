const db = require('./server/db');
const app = require('./server/app');

// Seed DB
// Start server on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

db.syncAndSeed();