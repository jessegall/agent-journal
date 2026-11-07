from core.base.database.migration import Migration


class EndedAgentRunsMigration(Migration):
    """Runs left going by an agent that has ended are settled as lost."""

    number = 10
    statements = ("UPDATE processes SET state = 'orphaned', ended_at = (SELECT ended_at FROM agents WHERE agents.id = processes.agent_id)"
                  " WHERE state IN ('running', 'background') AND agent_id IN (SELECT id FROM agents WHERE ended_at IS NOT NULL)",)
