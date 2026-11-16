from engine.actor.actor import CORE_ACTOR_ID
from engine.database.migration import Migration


class StockReaderDefaultsMigration(Migration):
    """Takes the default off the core's readers, so a reader a project adds for the same command comes first."""

    number = 31
    statements = [f"UPDATE readers SET is_default = 0 WHERE creator_id = {CORE_ACTOR_ID}"]
