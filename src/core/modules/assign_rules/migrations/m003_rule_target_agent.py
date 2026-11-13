from engine.database.migration import Migration


class RuleTargetAgentMigration(Migration):
    """Renames the column of the agent a rule gives tasks to target_agent_id, so it reads as the rule's target
    and never as the agent the row belongs to."""

    number = 3
    statements = ["ALTER TABLE assign_rules RENAME COLUMN agent_id TO target_agent_id"]
