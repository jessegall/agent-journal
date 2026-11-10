from engine.database.migration import Migration


class VitestReaderCommandsMigration(Migration):
    """The vitest reader the journal ships also reads a project's npm test lines, which run vitest."""

    number = 12
    statements = ["UPDATE readers SET commands = '*vitest*,npm*run test*,npm test*' WHERE name = 'vitest' AND creator_id = 1 AND commands = '*vitest*'"]
