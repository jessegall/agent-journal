from engine.database.migration import Migration
from engine.database.timestamp_sql import TIMESTAMP_SQL
from core.modules.sequences.agent_messages.step_waits_message import StepWaitsMessage


class CloseLegacyStepBlocksMigration(Migration):
    """Closes old command-based sequence blocks so the next hook uses the current step's state."""

    number = 4
    statements = [
        f"UPDATE agent_blocks SET closed_at = {TIMESTAMP_SQL}, updated_at = {TIMESTAMP_SQL}, version = version + 1"
        f" WHERE closed_at IS NULL AND nudge_key = '{StepWaitsMessage.declared().key}' AND condition_name = 'any-of'"
    ]
