from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_ENDED


class WorkerRunEndedListener(SaveListener):
    """A worker that has stopped while a run of its own went on in the background is told when the run ends, by a
    job line, which starts it again on its session."""

    name = "workers.run-ended"
    event = "process.*"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, nudger: Nudger) -> None:
        self.queries, self.worktrees, self.nudger = queries, worktrees, nudger

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if not isinstance(process, Process) or change.move is None or process.state in RUNNING_STATES:
            return
        agent = self.queries.query(Agent).find(process.agent_id)
        worktree = self.worktrees.worker_worktree(agent.id)
        if agent.role is not AgentRole.WORKER or agent.ended_at is None or worktree is None or worktree.state is not WorktreeState.CUT:
            return
        self.nudger.send(agent.id, WORKER_RUN_ENDED, WORKER_JOB_SOURCE, change.context, output=process.id)
