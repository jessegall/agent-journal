from engine.database.migration import Migration

ENVIRONMENT_MAIN_AGENT_ID = (
    "COALESCE("
    "(SELECT MAX(running.id) FROM agents AS running WHERE running.role = 'main' AND running.environment_id = agents.environment_id"
    " AND running.ended_at IS NULL AND running.retired_at IS NULL), "
    "(SELECT numbered.id FROM agents AS numbered WHERE numbered.role = 'main' AND numbered.environment_id = agents.environment_id"
    " AND numbered.number = 1), "
    "agents.parent_id)"
)


class MainAgentParentMigration(Migration):
    """Moves every kept agent that still sits under an ended main session of its environment to the main agent
    of that environment: the main session that runs, or else the row numbered 1. Journals made before a main
    session ran on the main agent's own row have such agents, and a line sent to their parent was read by
    nobody. A retired agent keeps the parent it had, and a second run changes nothing."""

    number = 24
    statements = [
        f"UPDATE agents SET parent_id = {ENVIRONMENT_MAIN_AGENT_ID} WHERE role != 'main' AND retired_at IS NULL AND parent_id IN ("
        "SELECT ended.id FROM agents AS ended WHERE ended.role = 'main' AND ended.ended_at IS NOT NULL AND ended.environment_id = agents.environment_id)",
    ]
