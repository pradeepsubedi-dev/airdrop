const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create a table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  }
);

// Create a table for deals if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        rating REAL NOT NULL,
        price TEXT NOT NULL
    )`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  }
);

// CREATE: Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function (err) {
    if (err) {
      console.error("Error inserting record:", err.message);
      return res.status(500).json({ error: "Failed to insert user." });
    }
    res.status(201).json({ message: "User added successfully.", id: this.lastID });
  });
});

// READ: Get all users
app.get("/users", (req, res) => {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).json({ error: "Failed to fetch users." });
    }
    res.status(200).json(rows);
  });
});

// READ: Get a single user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).json({ error: "Failed to fetch user." });
    }
    if (!row) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(row);
  });
});

// UPDATE: Update a user by ID
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function (err) {
    if (err) {
      console.error("Error updating user:", err.message);
      return res.status(500).json({ error: "Failed to update user." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: "User updated successfully." });
  });
});

// DELETE: Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).json({ error: "Failed to delete user." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  });
});

// CREATE: Add a new deal
app.post("/deals", (req, res) => {
  const { title, description, rating, price } = req.body;

  if (!title || !description || !rating || !price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `INSERT INTO deals (title, description, rating, price) VALUES (?, ?, ?, ?)`;
  db.run(sql, [title, description, rating, price], function (err) {
    if (err) {
      console.error("Error inserting record:", err.message);
      return res.status(500).json({ error: "Failed to insert deal." });
    }
    res.status(201).json({ message: "Deal added successfully.", id: this.lastID });
  });
});

// READ: Get all deals
app.get("/deals", (req, res) => {
  const sql = `SELECT * FROM deals`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching deals:", err.message);
      return res.status(500).json({ error: "Failed to fetch deals." });
    }
    res.status(200).json(rows);
  });
});

// READ: Get a single deal by ID
app.get("/deals/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM deals WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching deal:", err.message);
      return res.status(500).json({ error: "Failed to fetch deal." });
    }
    if (!row) {
      return res.status(404).json({ error: "Deal not found." });
    }
    res.status(200).json(row);
  });
});

// UPDATE: Update a deal by ID
app.put("/deals/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, rating, price } = req.body;

  if (!title || !description || !rating || !price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `UPDATE deals SET title = ?, description = ?, rating = ?, price = ? WHERE id = ?`;
  db.run(sql, [title, description, rating, price, id], function (err) {
    if (err) {
      console.error("Error updating deal:", err.message);
      return res.status(500).json({ error: "Failed to update deal." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Deal not found." });
    }
    res.status(200).json({ message: "Deal updated successfully." });
  });
});

// DELETE: Delete a deal by ID
app.delete("/deals/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM deals WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting deal:", err.message);
      return res.status(500).json({ error: "Failed to delete deal." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Deal not found." });
    }
    res.status(200).json({ message: "Deal deleted successfully." });
  });
});

// Close the database connection when the server is stopped
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
