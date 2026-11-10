from engine.enums.helper_role import HelperRole
from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from engine.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from engine.event.changed import Changed
from engine.command.context import Context
from core.modules.agents.support.agent_rows import AgentRows


class RemovedWorktreeAgentListener(SaveListener[Changed[Worktree]]):
    """A worker whose worktree is removed, by a merge or a release, has no work left: its helpers stop first
    and its session ends, also when its program never reported an end, so nothing keeps asking after it. The
    worker itself stays kept and idle, with its number and its memories, until a person retires it."""

    name = "workers.removed-worktree-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, bus: Bus, agents: AgentRows) -> None:
        self.rows, self.bus, self.agents = rows, bus, agents

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        worktree = event.row
        if worktree.state is not WorktreeState.REMOVED:
            return
        for helper in self.agents.running(HelperRole.HELPER, worktree.session_agent_id):
            self.bus.dispatch(EndAgent(helper.id), context)
        if self.rows.required(Agent, worktree.session_agent_id).ended_at is None:
            self.bus.dispatch(EndAgent(worktree.session_agent_id), context)
