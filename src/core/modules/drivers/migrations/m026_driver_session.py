from engine.database.migration import Migration


class DriverSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 26
    statements = ["ALTER TABLE hook_calls RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE agent_blocks RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE nudge_records RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE agent_lines RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE rule_histories RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE helper_jobs RENAME COLUMN agent_id TO session_agent_id"]
