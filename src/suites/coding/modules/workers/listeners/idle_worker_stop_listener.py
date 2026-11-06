from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.support.agent_program import AgentProgram
from suites.coding.modules.workers.commands.end_idle_worker.end_idle_worker import EndIdleWorker


class IdleWorkerStopListener(CommitListener[AgentEnded]):
    """Stops the program of a worker that was idle too long, after the tick, so no hook waits on a process."""

    name = "workers.idle-program-stop"

    def __init__(self, program: AgentProgram) -> None:
        self.program = program

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if logged.command == EndIdleWorker.label():
            self.program.stop(event.row)
