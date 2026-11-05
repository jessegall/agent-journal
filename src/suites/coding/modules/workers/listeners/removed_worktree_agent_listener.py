from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.listener.save_listener import SaveListener
from core.base.listener.event_rows import EventRows
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.changed import Changed
from core.base.command.context import Context


class RemovedWorktreeAgentListener(SaveListener[Changed[Worktree]]):
    """A worker whose worktree is removed, by a merge or a release, has no work left: its helpers stop first, and
    its row ends with it, also when its program never reported an end, so nothing keeps asking after it."""

    name = "workers.removed-worktree-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, bus: Bus, queries: Queries) -> None:
        self.rows, self.bus, self.queries = rows, bus, queries

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        worktree = event.row
        if worktree.state is not WorktreeState.REMOVED:
            return
        for helper in tuple(self.queries.query(Agent).filter(parent_id=worktree.session_agent_id, role=AgentRole.HELPER).matching(IsNull("ended_at")).all_rows()):
            self.bus.dispatch(EndAgent(helper.id), context)
        if self.rows.required(Agent, worktree.session_agent_id).ended_at is None:
            self.bus.dispatch(EndAgent(worktree.session_agent_id), context)
