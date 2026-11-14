from engine.database.migration import Migration


class MergerLineAskMigration(Migration):
    """A merger line says what a worker asks about and its facts, and a refusal count keeps its last text."""

    number = 55
    statements = (
        "ALTER TABLE merger_lines ADD COLUMN topic TEXT",
        "ALTER TABLE merger_lines ADD COLUMN facts_json TEXT",
        "ALTER TABLE worker_refusal_counts ADD COLUMN refusal_text TEXT",
    )
