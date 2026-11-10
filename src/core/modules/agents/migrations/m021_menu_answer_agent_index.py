from core.base.database.migration import Migration


class MenuAnswerAgentIndexMigration(Migration):
    """Indexes the menu answer rows of an agent, newest first."""

    number = 21
    statements = ["CREATE INDEX menu_answers_agent ON menu_answers (session_agent_id, id)"]
