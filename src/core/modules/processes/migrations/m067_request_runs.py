from engine.database.migration import Migration
from core.modules.processes.migrations.m001_processes import COMMON


class RequestRunsMigration(Migration):
    """Keeps one row for every hook, journal command, viewer request and run of the journal's own that went through
    the one door, apart from the runs of agents' shell lines."""

    number = 67
    statements = (
        "CREATE TABLE request_runs (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, session_agent_id INTEGER NOT NULL, creator_id INTEGER NOT NULL, kind TEXT NOT NULL,"
        " line TEXT NOT NULL, exit_code INTEGER NOT NULL, ended_at TEXT NOT NULL," + COMMON + ") STRICT",
        "CREATE INDEX request_runs_agent_time ON request_runs(session_agent_id, ended_at)",
        "CREATE INDEX request_runs_environment ON request_runs(environment_id, id)",
    )
