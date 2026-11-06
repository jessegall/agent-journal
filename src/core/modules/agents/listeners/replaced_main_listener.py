from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.support.agent_program import AgentProgram


class ReplacedMainListener(CommitListener[AgentEnded]):
    """Stops the program of a main agent that a new session replaced, after the hook, so no hook waits on a process."""

    name = "agents.replaced-main"

    def __init__(self, program: AgentProgram) -> None:
        self.program = program

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if logged.command == EndReplacedMain.label():
            self.program.stop(event.row)
