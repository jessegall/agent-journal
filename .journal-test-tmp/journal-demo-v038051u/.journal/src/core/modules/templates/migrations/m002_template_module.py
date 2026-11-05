from core.base.database.migration import Migration


class TemplateModuleColumnMigration(Migration):
    """Adds the module that registered a template."""

    number = 2
    statements = tuple(["ALTER TABLE templates ADD COLUMN module TEXT NOT NULL DEFAULT ''"])
