from journal.engine.clock import Clock
from journal.events.agent.wait_request import WaitRequest
from journal.events.agent.command_ended import CommandEnded
from journal.events.agent.command_moved import CommandMoved
from journal.events.agent.impasse_report import ImpasseReport
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.command_output import CommandOutput
from journal.repositories.agents import Agents
from journal.support.scope import Scope
from journal.support.caller import Caller


class CommandEvents:
    """The agent events a command or the runner raises, dispatched here as a hook's are: a command moved to the background and a moved command's end, each by its output's number; a wait the agent declares; the agent saying it is stuck."""

    def __init__(self, bus: Bus, clock: Clock, scope: Scope, agents: Agents) -> None:
        self.bus, self.clock, self.scope, self.agents = bus, clock, scope, agents

    def moved(self, output: CommandOutput, session: str) -> None:
        self.bus.dispatch(CommandMoved(output=output.id).placed(session, self.scope.id, "", None, self.clock.time()))

    def ended(self, output: CommandOutput, agent: Agent) -> None:
        self.bus.dispatch(CommandEnded(output=output.id, status=output.status).placed(agent.session, self.scope.id, agent.provider, None, self.clock.time()))

    def wait_declared(self, what: str, ends_on: str, caller: Caller) -> None:
        self.bus.dispatch(WaitRequest(what=what, ends_on=ends_on).placed(caller.session, self.scope.id, self.provider_of(caller), None, self.clock.time()))

    def help_needed(self, why: str, caller: Caller) -> None:
        self.bus.dispatch(ImpasseReport(why=why).placed(caller.session, self.scope.id, self.provider_of(caller), None, self.clock.time()))

    def provider_of(self, caller: Caller) -> str:
        return self.agents.session_agent(caller.session).provider
