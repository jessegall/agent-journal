from engine.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class AgentSessionsMigration(Migration):
    """Makes the history of an agent's sessions and gives every agent its first row: its current session,
    started when the agent was made, and ended for an unknown reason when the agent has ended. Only agents
    without a row get one, so a second run changes nothing."""

    number = 23
    statements = [
        "CREATE TABLE IF NOT EXISTS agent_sessions (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, session TEXT NOT NULL, program TEXT NOT NULL,"
        " program_model TEXT NOT NULL DEFAULT '', started_at TEXT NOT NULL, ended_at TEXT, end_reason TEXT NOT NULL DEFAULT ''," + COMMON,
        "CREATE INDEX IF NOT EXISTS agent_sessions_session ON agent_sessions (session, id)",
        "CREATE INDEX IF NOT EXISTS agent_sessions_agent_started_at ON agent_sessions (session_agent_id, started_at)",
        "CREATE INDEX IF NOT EXISTS agent_sessions_environment ON agent_sessions (environment_id, id)",
        "INSERT INTO agent_sessions (session_agent_id, environment_id, session, program, program_model, started_at, ended_at, end_reason, created_at, updated_at)"
        " SELECT id, environment_id, session, program, program_model, created_at, ended_at, CASE WHEN ended_at IS NULL THEN '' ELSE 'unknown' END, created_at, updated_at"
        " FROM agents WHERE NOT EXISTS (SELECT 1 FROM agent_sessions WHERE agent_sessions.session_agent_id = agents.id)",
    ]
