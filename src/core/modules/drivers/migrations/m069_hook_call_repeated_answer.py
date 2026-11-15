from engine.database.migration import Migration


class HookCallRepeatedAnswerMigration(Migration):
    """Gives a hook call the refusal that overrode its stored answer when the hook came again, so a replay
    that refused what was allowed before is on the record (doc 1310 section 4.1, route item 3)."""

    number = 69
    statements = ["ALTER TABLE hook_calls ADD COLUMN repeated_answer TEXT NOT NULL DEFAULT ''"]
