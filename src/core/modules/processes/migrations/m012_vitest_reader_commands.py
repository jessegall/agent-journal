from engine.actor.actor import CORE_ACTOR_ID
from engine.database.migration import Migration


class VitestReaderCommandsMigration(Migration):
    """The vitest reader the journal ships also reads a project's npm test lines, which run vitest."""

    number = 12
    statements = [f"UPDATE readers SET commands = '*vitest*,npm*run test*,npm test*' WHERE name = 'vitest' AND creator_id = {CORE_ACTOR_ID} AND commands = '*vitest*'"]
