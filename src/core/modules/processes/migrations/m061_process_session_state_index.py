from core.base.database.migration import Migration


class ProcessSessionStateIndexMigration(Migration):
    """Finds an agent's open runs within its environment by one index, so a rule that lists them on every hook
    reads none of the ended runs."""

    number = 61
    statements = ["CREATE INDEX processes_session_state_environment ON processes (session_agent_id, state, environment_id)"]
