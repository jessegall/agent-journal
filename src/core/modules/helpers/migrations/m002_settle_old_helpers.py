from engine.database.migration import Migration
from core.modules.agents.models.agent import UPGRADE_RETIREMENT_REASON

KEPT = 8
REASON = UPGRADE_RETIREMENT_REASON


class RetireOldHelpersMigration(Migration):
    """Retires the ended helpers beyond the newest of each profile, once, since every agent used to end for good."""

    number = 2
    statements = [f"""UPDATE agents SET retired_at = ended_at, retirement_reason = '{REASON}' WHERE id IN (
        SELECT id FROM (SELECT id, ended_at, ROW_NUMBER() OVER (PARTITION BY environment_id, profile ORDER BY id DESC) AS place
                        FROM agents WHERE role = 'helper' AND ended_at IS NOT NULL AND retired_at IS NULL)
        WHERE place > {KEPT} OR id IN (SELECT id FROM agents WHERE role = 'helper' AND profile = ''))"""]
