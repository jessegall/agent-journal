from core.base.actor import CORE_ACTOR_ID
from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL


class ExistingEnvironmentDocksMigration(Migration):
    """Makes the dock of every environment that has none, so an environment made before the docking module was
    installed has one; the listener makes the dock of each environment made after."""

    number = 2
    statements = (
        f"INSERT INTO docks (environment_id, creator_id, created_at, updated_at) SELECT id, {CORE_ACTOR_ID}, {TIMESTAMP_SQL}, {TIMESTAMP_SQL} FROM environments"
        " WHERE id NOT IN (SELECT environment_id FROM docks)",
    )
