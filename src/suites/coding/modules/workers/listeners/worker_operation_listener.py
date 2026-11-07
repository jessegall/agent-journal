from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch


class WorkerOperationListener(CommitListener[Created[WorkerOperation]]):
    """Starts accepted worker commands through the journal runner after their reservation commits."""

    name = "workers.operation-launch"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, launch: QueuedProcessLaunch) -> None:
        self.rows, self.launch = rows, launch

    def handle(self, event: Created[WorkerOperation], logged: LoggedEvent) -> None:
        process = self.rows.required(Process, event.row.process_id)
        agent = self.rows.required(Agent, process.session_agent_id)
        self.launch.start(process.id, process.line, process.folder, agent.session, ForegroundRun(0, False, queued=True))
