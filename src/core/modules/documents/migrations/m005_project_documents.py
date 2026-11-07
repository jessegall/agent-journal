from core.base.database.migration import Migration


class ProjectDocumentsMigration(Migration):
    """Removes environment ownership from existing documents and reports."""

    number = 5
    statements = (
        "ALTER TABLE docs DROP COLUMN environment_id",
        "ALTER TABLE reports DROP COLUMN environment_id",
    )
