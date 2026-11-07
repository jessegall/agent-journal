from core.base.database.migration import Migration


class ProcessStateIndexMigration(Migration):
    """An agent's runs in one state are found through an index, as every hook asks for the running ones."""

    number = 7
    statements = tuple(["CREATE INDEX processes_agent_state ON processes (agent_id, state, id)"])
