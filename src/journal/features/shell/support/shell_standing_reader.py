from journal.features.shell.support.shell_standing import ShellStanding
from journal.models.agent import Agent
from journal.repositories.command_outputs import CommandOutputs


class ShellStandingReader:
    """Reads the shell feature's part of the Standing for an agent."""

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def read(self, agent: Agent) -> ShellStanding:
        return ShellStanding(background=tuple(o.id for o in self.outputs.in_background(agent.session)))
