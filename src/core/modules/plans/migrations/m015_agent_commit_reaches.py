from engine.database.migration import Migration


class AgentCommitReachesMigration(Migration):
    """Names a checkpoint run on the commit of the agent holding its window by what it is: every reach that is not
    merged or early ran on such a commit."""

    number = 15
    statements = [
        "DROP TRIGGER IF EXISTS checkpoint_reaches_rule_source_insert",
        "DROP TRIGGER IF EXISTS checkpoint_reaches_rule_source_update",
        "UPDATE checkpoint_reaches SET source = 'agent_commit' WHERE source NOT IN ('merged', 'early')",
    ]
