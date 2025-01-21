const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./database.db');  // SQLite DB file

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);
});

// Middleware for parsing JSON
app.use(express.json());

// Simulating a simple data fetch
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Route to get all users from the database
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Route to add a new user to the database
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    // Simple validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    stmt.run(name, email, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, email });
    });
    stmt.finalize();
});

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
