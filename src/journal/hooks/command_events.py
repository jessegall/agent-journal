from journal.engine.clock import Clock
from journal.events.agent.wait_request import WaitRequest
from journal.events.agent.command_ended import CommandEnded
from journal.events.agent.command_moved import CommandMoved
from journal.events.agent.impasse_report import ImpasseReport
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.command_output import CommandOutput
from journal.repositories.scope import Scope
from journal.support.caller import Caller


class CommandEvents:
    """The agent events a command or the runner raises, dispatched here as a hook's are: a command moved to the background and a moved command's end, each by its output's number; a wait the agent declares; the agent saying it is stuck."""

    def __init__(self, bus: Bus, clock: Clock, scope: Scope) -> None:
        self.bus, self.clock, self.scope = bus, clock, scope

    def moved(self, output: CommandOutput, session: str) -> None:
        self.bus.dispatch(CommandMoved(output=output.id).placed(session, self.scope.id, "", None, self.clock.time()))

    def ended(self, output: CommandOutput, agent: Agent) -> None:
        self.bus.dispatch(CommandEnded(output=output.id, status=output.status).placed(agent.session, self.scope.id, agent.provider, None, self.clock.time()))

    def wait_declared(self, subject: str, end_refs: str, caller: Caller) -> None:
        self.bus.dispatch(WaitRequest(focus=subject, end_refs=end_refs).placed(caller.agent_session, self.scope.id, caller.agent_provider, None, self.clock.time()))

    def help_needed(self, reason: str, caller: Caller) -> None:
        self.bus.dispatch(ImpasseReport(reason=reason).placed(caller.agent_session, self.scope.id, caller.agent_provider, None, self.clock.time()))
