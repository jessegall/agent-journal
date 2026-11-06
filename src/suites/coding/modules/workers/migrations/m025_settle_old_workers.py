from core.base.database.migration import Migration
from core.modules.agents.models.agent import UPGRADE_RETIREMENT_REASON

KEPT = 8
REASON = UPGRADE_RETIREMENT_REASON


class RetireOldWorkersMigration(Migration):
    """Retires the ended workers beyond the newest of an environment, once, unless a worktree is still open for one."""

    number = 25
    statements = [f"""UPDATE agents SET retired_at = ended_at, retirement_reason = '{REASON}' WHERE id IN (
        SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY environment_id ORDER BY id DESC) AS place
                        FROM agents WHERE role = 'worker' AND ended_at IS NOT NULL AND retired_at IS NULL
                        AND id NOT IN (SELECT session_agent_id FROM worker_worktrees WHERE removed_at IS NULL))
        WHERE place > {KEPT})"""]
