from controllers.types import Environments
from events.messages import MessageCreated
from events.starting_agents import WakeRequested
from expects import Dispatches, Given, Ran, Refused, Updated, answering, at, nothing
from features.starting_agents.commands import Launch, no_such_agent
from features.starting_agents.details import StartingAgentsDetails
from features.starting_agents.handlers import CarryOnTheConversation
from features.starting_agents.listeners import SpotMessageToWake
from framework.base import Feature
from framework.journal import Journal
from providers import DRIVERS
from resources.types import AgentRow, Environment, Message

NOW = at(1_000.0)
ON = {"starting_agents.wake_on_message": True}
START = ("start detached", "t", "codex", tuple(DRIVERS["codex"].AUTO_ARGS), "bea86f27-last")


def ended(n: int, title: str, provider: str, when: float, **more) -> AgentRow:
    return AgentRow(n=n, title=title, data={"event": "SessionEnd", "provider": provider, "at": when, **more})


CONVERSATIONS = [ended(1, "4d863ccb-old", "claude", 100.0), ended(2, "bea86f27-last", "codex", 200.0), ended(3, "claude-20640", "claude", 300.0, event="")]


def written(by: str, n: int = 1) -> Message:
    return Message(n=n, title="are you there?", seen=[by])


class StartingAgents(Feature):
    details = StartingAgentsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", Launch(), expects=[
            Given((Environments, 1, "bogus")) >> Refused(no_such_agent("bogus")),
        ])
        journal.events.listen(MessageCreated, SpotMessageToWake(), expects=[
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), *CONVERSATIONS], settings=ON, clock=NOW)
                >> Dispatches(WakeRequested(environment="t", n=1, provider="codex", conversation="bea86f27-last")),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), *CONVERSATIONS], settings={"starting_agents.wake_on_message": False}, clock=NOW)
                >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("agent"), Environment(n=1, title="t"), *CONVERSATIONS], settings=ON, clock=NOW) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t", data={"launched": 990.0}), *CONVERSATIONS], settings=ON, clock=NOW)
                >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), *CONVERSATIONS], settings=ON, clock=NOW) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t")], settings=ON, clock=NOW) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), ended(2, "bea86f27-last", "codex", 200.0, subagent=True)], settings=ON, clock=NOW)
                >> Dispatches(nothing),
        ])
        journal.events.handle(WakeRequested, CarryOnTheConversation(), expects=[
            Given(WakeRequested(environment="t", n=1, provider="codex", conversation="bea86f27-last"), rows=[Environment(n=1, title="t")], clock=NOW, processes=answering({START: 4242}))
                >> Ran(START) & Updated(Environment(n=1), launched=1_000.0, launched_agent="codex"),
        ])
