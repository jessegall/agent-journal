from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.event.moved import Moved
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_REFUSAL
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class WorkerMergeBlockListener(SaveListener[Moved[Worktree]]):
    """Ends the merge reminder when the delivered work no longer waits for a merge."""

    name = "workers.settled-worker-block"
    moves = (WorktreeLifecycle.merge, WorktreeLifecycle.rework, WorktreeLifecycle.abandon)
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus, numbers: RowNumbers) -> None:
        self.queries, self.bus, self.numbers = queries, bus, numbers

    def handle(self, event: Moved[Worktree], context: Context) -> None:
        command = self.merge_command(event.row)
        key = f"{REQUIRED_COMMAND_REFUSAL.key}:{command}"
        blocks = self.queries.query(AgentBlock).filter(nudge_key=key, condition_text=command).matching(IsNull("closed_at")).get()
        for block in blocks:
            self.bus.dispatch(CloseAgentBlock(block.id), context)

    def merge_command(self, worktree: Worktree) -> str:
        return f"journal worker merge {self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)}"
