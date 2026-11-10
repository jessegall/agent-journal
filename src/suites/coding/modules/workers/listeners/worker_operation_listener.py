from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from engine.actor.actor import Actor
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart


class WorkerOperationListener(CommitListener[Created[WorkerOperation]]):
    """Starts accepted worker commands through the journal runner after their reservation commits, in the urgent
    round, so a slow listener cannot hold a command back until its run counts as lost."""

    name = "workers.operation-launch"
    run_order = -1
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, launch: QueuedProcessLaunch, folder: OutputFolder, bus: Bus) -> None:
        self.rows, self.launch, self.folder, self.bus = rows, launch, folder, bus

    def handle(self, event: Created[WorkerOperation], logged: LoggedEvent) -> None:
        process = self.rows.required(Process, event.row.process_id)
        if process.ended_at is not None:
            return
        agent = self.rows.required(Agent, process.session_agent_id)
        try:
            self.launch.start(QueuedProcessStart(process, process.line, agent.session), ForegroundRun(0, False, queued=True))
        except OSError as error:
            text = f"worker command could not start: {error}\n"
            self.folder.write_output(process.id, 1, text)
            self.folder.write_end(process.id, 3)
            self.bus.run(EndProcess(process.id, 3, len(text.encode()), 1), Actor.core(),
                         cause_id=logged.id, environment_id=process.environment_id)
