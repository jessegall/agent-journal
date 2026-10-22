from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.shell.shell_conduct import SILENCE_SECONDS
from journal.repositories.command_outputs import CommandOutputs
from journal.support.actor import Actor


class OutputNotice(AgentListener[Ticked]):
    """The commands that ended in the background are marked told at the tick the shell conduct names them, once the agent is quiet."""

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def handle(self, event: Ticked) -> None:
        if event.silence_seconds < SILENCE_SECONDS:
            return
        for output in self.outputs.unannounced(event.session):
            self.outputs.save(output.announced(), Actor.system())
