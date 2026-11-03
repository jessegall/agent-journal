from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL
from core.modules.sequences.support.sequence_nudges import STEP_WAITS


class CloseLegacyStepBlocksMigration(Migration):
    """Closes old command-based sequence blocks so the next hook uses the current step's state."""

    number = 4
    statements = [
        f"UPDATE agent_blocks SET closed_at = {TIMESTAMP_SQL}, updated_at = {TIMESTAMP_SQL}, version = version + 1"
        f" WHERE closed_at IS NULL AND nudge_key = '{STEP_WAITS.key}' AND condition_name = 'any-of'"
    ]
