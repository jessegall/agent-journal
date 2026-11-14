from engine.database.migration import Migration


class MessageFlowchartMigration(Migration):
    """A message may carry a flowchart's arrows, each from, to and label."""

    number = 7
    statements = ["ALTER TABLE messages ADD COLUMN flowchart_edges TEXT NOT NULL DEFAULT '[]'"]
