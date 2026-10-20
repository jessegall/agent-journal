from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.shell.support.shell_conduct import QUIET_FOR
from journal.repositories.command_outputs import CommandOutputs
from journal.support.actor import Actor


class MarkOutputsTold(AgentListener[Ticked]):
    """The commands that ended in the background are marked told at the tick the shell conduct names them, once the agent is quiet."""

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def handle(self, event: Ticked) -> None:
        if event.quiet_for < QUIET_FOR:
            return
        for output in self.outputs.ended_untold(event.session):
            self.outputs.save(output.told_of(), Actor.system())
