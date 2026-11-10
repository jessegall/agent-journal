from engine.database.migration import Migration


class SkillSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 3
    statements = ["ALTER TABLE skill_requests RENAME COLUMN agent_id TO session_agent_id",
                  "ALTER TABLE agent_skills RENAME COLUMN agent_id TO session_agent_id"]
