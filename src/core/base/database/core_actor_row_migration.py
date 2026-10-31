from core.base.actor import CORE_ACTOR_ID
from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL


class CoreActorRowMigration(Migration):
    """Creates the core's own actor in the core's migrations, so a module's migration may name it as the creator
    of the rows it seeds."""

    number = 2
    statements = (
        f"INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES ({CORE_ACTOR_ID}, 'core', 'core', {TIMESTAMP_SQL}, {TIMESTAMP_SQL})",
    )
