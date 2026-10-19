
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "environmental.db"


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    with get_db() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,
                event_date TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
            );

            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS surveys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                waste_segregation TEXT NOT NULL,
                water_conservation TEXT NOT NULL,
                transport_method TEXT NOT NULL,
                submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS quiz_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer TEXT NOT NULL
                    CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
                explanation TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id TEXT PRIMARY KEY,
                question_ids TEXT NOT NULL,
                submitted INTEGER NOT NULL DEFAULT 0
            );
        """)

        # Add default campaigns only if none exist.
        campaign_count = db.execute(
            "SELECT COUNT(*) FROM campaigns"
        ).fetchone()[0]

        if campaign_count == 0:
            db.executemany(
                """
                INSERT INTO campaigns
                    (title, description, location, event_date)
                VALUES (?, ?, ?, ?)
                """,
                [
                    (
                        "Tree Plantation Drive",
                        "Plant trees and promote green spaces.",
                        "Community Park",
                        "2026-11-15",
                    ),
                    (
                        "Cleanliness Campaign",
                        "Help clean public spaces in your community.",
                        "Community Area",
                        "2026-11-22",
                    ),
                    (
                        "Recycling Awareness",
                        "Learn about waste segregation and recycling.",
                        "Community Hall",
                        "2026-11-29",
                    ),
                ],
            )

        # Keep existing quiz questions unchanged.
        # Do not automatically insert the 50-question bank.
        # Your existing 8 questions remain in the database.

        db.commit()


if __name__ == "__main__":
    initialize_database()

    print(f"Database initialized successfully: {DB_PATH}")

    with get_db() as db:
        print(
            "Quiz question count:",
            db.execute(
                "SELECT COUNT(*) FROM quiz_questions"
            ).fetchone()[0],
        )

        print(
            "Quiz attempt table exists:",
            db.execute("""
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                  AND name = 'quiz_attempts'
            """).fetchone() is not None,
        )
