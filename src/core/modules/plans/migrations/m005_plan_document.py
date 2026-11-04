from core.base.database.migration import Migration


class PlanDocumentMigration(Migration):
    """A plan can name the document it was designed in."""

    number = 5
    statements = ["ALTER TABLE plans ADD COLUMN document_id INTEGER"]
