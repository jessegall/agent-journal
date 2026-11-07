from core.base.database.migration import Migration


class AgentLineNudgeMigration(Migration):
    number = 36
    statements = ["ALTER TABLE agent_lines ADD COLUMN nudge_json TEXT"]
