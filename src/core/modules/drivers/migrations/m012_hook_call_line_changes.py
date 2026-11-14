from engine.database.migration import Migration


class HookCallLineChangesMigration(Migration):
    """Adds the lines a tool call adds and removes to the hook calls, so the running line can show them."""

    number = 12
    statements = [
        "ALTER TABLE hook_calls ADD COLUMN lines_added INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE hook_calls ADD COLUMN lines_removed INTEGER NOT NULL DEFAULT 0",
    ]
