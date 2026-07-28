const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'bolao.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        db.exec(sql, (err) => (err ? reject(err) : resolve()));
    });
}

function query(text, params = []) {
    const normalizedText = text.trim().toUpperCase();

    if (normalizedText.startsWith('SELECT')) {
        return new Promise((resolve, reject) => {
            db.all(text, params, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ rows, rowCount: rows.length });
            });
        });
    }

    return new Promise((resolve, reject) => {
        db.run(text, params, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({ rowCount: this.changes });
        });
    });
}

module.exports = {
    initializeDatabase,
    query
};
