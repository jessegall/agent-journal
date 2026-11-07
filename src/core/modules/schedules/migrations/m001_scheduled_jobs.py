from core.base.database.migration import Migration


class ScheduledJobsTableMigration(Migration):
    """Creates the scheduled jobs table."""

    number = 1
    statements = (
        "CREATE TABLE scheduled_jobs (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " job_id TEXT NOT NULL, cron TEXT NOT NULL, prompt TEXT NOT NULL, is_recurring INTEGER NOT NULL DEFAULT 1 CHECK (is_recurring IN (0, 1)), stop_asked_at TEXT, ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX scheduled_jobs_agent ON scheduled_jobs (agent_id, ended_at)",
    )
