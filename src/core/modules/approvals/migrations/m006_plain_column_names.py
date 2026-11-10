from engine.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 6
    statements = ["ALTER TABLE approvals RENAME COLUMN answered_by_id TO responder_id",
                  "ALTER TABLE approvals RENAME COLUMN relayed_by_id TO relayer_id",
                  "ALTER TABLE standing_approvals RENAME COLUMN same_key TO match_key"]
