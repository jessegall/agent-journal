from journal.engine.clock import Clock
from journal.events.agent.command_ended import CommandEnded
from journal.events.agent.command_moved import CommandMoved
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.command_output import CommandOutput
from journal.support.scope import Scope


class CommandEvents:
    """The runner's own agent events, dispatched here as a hook's are: a command moved to the background, and a moved command's end, each by its output's number."""

    def __init__(self, bus: Bus, clock: Clock, scope: Scope) -> None:
        self.bus, self.clock, self.scope = bus, clock, scope

    def moved(self, output: CommandOutput, session: str) -> None:
        self.bus.dispatch(CommandMoved(output=output.id).placed(session, self.scope.id, "", None, self.clock.now()))

    def ended(self, output: CommandOutput, agent: Agent) -> None:
        self.bus.dispatch(CommandEnded(output=output.id, status=output.status).placed(agent.session, self.scope.id, agent.provider, None, self.clock.now()))
