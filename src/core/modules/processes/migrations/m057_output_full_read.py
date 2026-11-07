from core.base.database.migration import Migration


class OutputFullReadMigration(Migration):
    number = 57
    statements = ["ALTER TABLE outputs ADD COLUMN fully_read_at TEXT",
                  "ALTER TABLE outputs ADD COLUMN full_read_output_id INTEGER REFERENCES processes(id)",
                  "CREATE INDEX outputs_full_read_output ON outputs (full_read_output_id)"]
