from core.base.database.migration import Migration


class CommandTypesMigration(Migration):
    """Renames the table of the types agents gave commands the journal could not classify, keeping its rows."""

    number = 6
    statements = ("ALTER TABLE command_kinds RENAME TO command_types",)
