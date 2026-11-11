from pathlib import Path
from types import SimpleNamespace

from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from core.modules.agents.commands.start_agent_program.start_agent_program_handler import StartAgentProgramHandler
from core.modules.agents.commands.stop_agent_program.stop_agent_program import StopAgentProgram
from core.modules.agents.commands.stop_agent_program.stop_agent_program_handler import StopAgentProgramHandler
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.models.enums.stopped import Stopped

AGENT = SimpleNamespace(id=41)
AGENTS = SimpleNamespace(find=lambda agent_id: AGENT)
CONTEXT = SimpleNamespace()


class RecordingDispatcher:
    """Keeps what each handler asked of the dispatcher."""

    def __init__(self) -> None:
        self.starts, self.stops = [], []

    def start(self, agent, command) -> Dispatch:
        self.starts.append((agent, command))
        return Dispatch.STARTED

    def stop(self, agent, reason, context) -> Stopped:
        self.stops.append((agent, reason, context))
        return Stopped.PROGRAM_ENDED


def test_a_start_hands_the_dispatcher_the_agent_and_its_program_line_folder_and_variables():
    dispatcher = RecordingDispatcher()
    command = StartAgentProgram(41, ("claude", "-p", "Read src/cart.py"), "/work/journal", {"JOURNAL_ENV": "main"})
    assert StartAgentProgramHandler(dispatcher, AGENTS).handle(command, CONTEXT) is Dispatch.STARTED
    agent, launch = dispatcher.starts[0]
    assert (agent, launch.arguments, launch.folder, dict(launch.variables)) == (AGENT, ("claude", "-p", "Read src/cart.py"), Path("/work/journal"), {"JOURNAL_ENV": "main"})


def test_a_stop_hands_the_dispatcher_the_agent_the_reason_and_the_context_of_the_command():
    dispatcher = RecordingDispatcher()
    assert StopAgentProgramHandler(dispatcher, AGENTS).handle(StopAgentProgram(41, StopReason.PERSON), CONTEXT) is Stopped.PROGRAM_ENDED
    assert dispatcher.stops == [(AGENT, StopReason.PERSON, CONTEXT)]
