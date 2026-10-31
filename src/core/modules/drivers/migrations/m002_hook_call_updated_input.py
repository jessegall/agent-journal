from core.base.database.migration import Migration


class HookCallUpdatedInputMigration(Migration):
    """Adds the new input a rule gave the tool to the hook calls, as JSON, so a hook sent twice is answered the same."""

    number = 2
    statements = ("ALTER TABLE hook_calls ADD COLUMN updated_input TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(updated_input))",)
