from engine.database.migration import Migration


class RequiredCommandTypeMigration(Migration):
    """Marks of a skipped required command take the type's new name, so they keep their family and icon."""

    number = 8
    statements = ["UPDATE chat_marks SET type = 'drivers.required_command-skipped' WHERE type = 'drivers.debt-skipped'"]
