from engine.database.migration import Migration


class AgentLineMessageMigration(Migration):
    number = 37
    statements = ["ALTER TABLE agent_lines ADD COLUMN nudge_json TEXT"]
