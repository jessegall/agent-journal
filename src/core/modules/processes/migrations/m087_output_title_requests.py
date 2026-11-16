from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class OutputTitleRequestsMigration(Migration):
    """Keeps a request for each run moved to the background whose agent is asked to name it, until it is titled or
    ends."""

    number = 87
    statements = (
        "CREATE TABLE output_title_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,"
        " closed_at TEXT," + COMMON + ") STRICT",
        "CREATE INDEX output_title_requests_open ON output_title_requests (session_agent_id, closed_at)",
        "CREATE UNIQUE INDEX output_title_requests_process ON output_title_requests (process_id)",
    )
