from core.modules.processes.events.process_ended import ProcessEnded
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
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
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from core.base.command.context import Context


class WorkerRunEndedListener(SaveListener[ProcessEnded]):
    """A worker that has stopped while a run of its own went on in the background is told when the run
    ends, by a job line, which starts it again on its session; one a person or another agent stopped, or
    that asked for help, stays stopped."""

    name = "workers.run-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, nudger: Nudger, stop: WorkerStop) -> None:
        self.queries, self.worktrees, self.nudger, self.stop = queries, worktrees, nudger, stop

    def handle(self, event: ProcessEnded, context: Context) -> None:
        process = event.row
        agent = self.queries.query(Agent).find(process.agent_id)
        worktree = self.worktrees.worker_worktree(agent.id)
        if agent.role != AgentRole.WORKER or agent.ended_at is None or worktree is None or worktree.state is not WorktreeState.CUT:
            return
        if self.stop.was_stopped(agent) or self.stop.has_open_help_request(agent.id):
            return
        self.nudger.send(agent.id, WORKER_RUN_ENDED, WORKER_JOB_SOURCE, context, output=process.id)
