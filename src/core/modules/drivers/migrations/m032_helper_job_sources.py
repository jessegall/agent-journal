from engine.database.migration import Migration


class HelperJobSourcesMigration(Migration):
    """Keeps request snapshots and pending follow-up boundaries on helper jobs."""

    number = 32
    statements = [
        "ALTER TABLE helper_jobs ADD COLUMN source_message_id INTEGER",
        "ALTER TABLE helper_jobs ADD COLUMN source_version INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE helper_jobs ADD COLUMN source_unavailable INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE helper_jobs ADD COLUMN source_line_id INTEGER REFERENCES agent_lines(id) ON DELETE SET NULL",
        "ALTER TABLE helper_jobs ADD COLUMN started_at TEXT",
        "UPDATE helper_jobs SET started_at = created_at",
        "CREATE INDEX helper_jobs_source_line ON helper_jobs (source_line_id)",
        "CREATE INDEX helper_jobs_source_message ON helper_jobs (source_message_id)",
    ]
