from engine.database.migration import Migration


class AliasSilenceMigration(Migration):
    """Records when a saved command's run printed nothing and when its line was edited after that."""

    number = 5
    statements = ["ALTER TABLE aliases ADD COLUMN silent_at TEXT", "ALTER TABLE aliases ADD COLUMN fixed_at TEXT"]
