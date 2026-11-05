from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL
from core.modules.memories.models.memory import FADING_REMOVAL_REASON


class RemoveFadedMemoriesMigration(Migration):
    """Removes active zero-weight memories whose types fade, preserving permanent types."""

    number = 3
    statements = [
        f"UPDATE memories SET state = 'removed', removed_at = {TIMESTAMP_SQL}, updated_at = {TIMESTAMP_SQL},"
        f" reason = '{FADING_REMOVAL_REASON}', version = version + 1"
        " WHERE state = 'active' AND weight = 0 AND type IN (SELECT name FROM memory_types WHERE fades = 1)"
    ]
