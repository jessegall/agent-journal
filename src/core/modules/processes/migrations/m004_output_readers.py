from core.base.database.migration import Migration


class OutputReadersMigration(Migration):
    """Gives each output the reader chosen at the start and what the reader has made of the bytes it passed."""

    number = 4
    statements = (
        "ALTER TABLE outputs ADD COLUMN reader_id INTEGER REFERENCES readers(id) ON DELETE SET NULL",
        "ALTER TABLE outputs ADD COLUMN read_offset INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE outputs ADD COLUMN read_lines INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE outputs ADD COLUMN reader_lines INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE outputs ADD COLUMN reader_summary TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE outputs ADD COLUMN progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100)",
        "ALTER TABLE outputs ADD COLUMN ended_at TEXT",
    )
