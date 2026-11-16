from engine.database.migration import Migration


class SkipApprovalAndUnjudgedBlocksMigration(Migration):
    """A refusal skip's approval takes the plain column name its field uses, and a block's judgement columns,
    which nothing ever wrote, go."""

    number = 81
    statements = [
        "ALTER TABLE refusal_skips RENAME COLUMN needs_approval TO requires_approval",
        "ALTER TABLE agent_blocks DROP COLUMN judgement",
        "ALTER TABLE agent_blocks DROP COLUMN judgement_reason",
    ]
