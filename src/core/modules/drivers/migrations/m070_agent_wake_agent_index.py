from engine.database.migration import Migration


class AgentWakeAgentIndexMigration(Migration):
    """Finds an agent's wake obligation for a work generation by index, as each step's save and each hook's
    acknowledgement ask; the partial index of the active rows cannot answer a query that names the states."""

    number = 70
    statements = ["CREATE INDEX agent_wakes_agent ON agent_wakes (session_agent_id, work_generation, state)"]
