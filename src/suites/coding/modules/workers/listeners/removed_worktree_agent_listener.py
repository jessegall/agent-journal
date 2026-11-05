from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.changed import Changed
from core.base.command.context import Context


class RemovedWorktreeAgentListener(SaveListener[Changed[Worktree]]):
    """A worker whose worktree is removed, by a merge or a release, has no work left: its row ends with it, also
    when its program never reported an end, so nothing keeps asking after it."""

    name = "workers.removed-worktree-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        worktree = event.row
        if not isinstance(worktree, Worktree) or worktree.state is not WorktreeState.REMOVED:
            return
        if self.queries.query(Agent).find(worktree.agent_id).ended_at is None:
            self.bus.dispatch(EndAgent(worktree.agent_id), context)
