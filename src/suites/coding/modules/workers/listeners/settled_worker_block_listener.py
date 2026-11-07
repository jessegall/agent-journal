from core.base.change.moved import Moved
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_REFUSAL
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class SettledWorkerBlockListener(SaveListener[Moved[Worktree]]):
    """Ends the merge reminder when the delivered work no longer waits for a merge."""

    name = "workers.settled-worker-block"
    moves = (WorktreeLifecycle.merge, WorktreeLifecycle.rework, WorktreeLifecycle.abandon)
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: Moved[Worktree], context: Context) -> None:
        command = f"journal worker merge {event.row.session_agent_id}"
        key = f"{REQUIRED_COMMAND_REFUSAL.key}:{command}"
        blocks = self.queries.query(AgentBlock).filter(nudge_key=key, condition_text=command).matching(IsNull("closed_at")).all_rows()
        for block in blocks:
            self.bus.dispatch(CloseAgentBlock(block.id), context)
