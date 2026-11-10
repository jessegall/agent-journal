from engine.database.migration import Migration


class MergerVisitClosedMigration(Migration):
    """Records whether the merger acted on what it read, and which lines came back to it."""

    number = 57
    statements = (
        "ALTER TABLE merger_visits ADD COLUMN closed_at TEXT",
        "UPDATE merger_visits SET closed_at = created_at",
        "CREATE INDEX merger_visits_open ON merger_visits (environment_id) WHERE closed_at IS NULL",
        "ALTER TABLE merger_lines ADD COLUMN visit_id INTEGER",
        "ALTER TABLE merger_lines ADD COLUMN returned_at TEXT",
        "CREATE INDEX merger_lines_visit ON merger_lines (visit_id)",
    )
