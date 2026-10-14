import json
import os

from controllers.types import Environments
from events.messages import MessageCreated
from events.starting_agents import WakeRequested
from expects import Acted, Answering, Dispatches, Given, Ran, Refused, Updated, answering, at, nothing
from features.starting_agents.commands import Launch, no_such_agent
from features.starting_agents.details import StartingAgentsDetails
from features.starting_agents.handlers import CarryOnTheConversation
from features.starting_agents.listeners import SpotMessageToWake
from framework.base import Feature
from framework.journal import Journal
from resources.base import AGENT
from resources.types import AgentRow, Environment, Message
from serving import SERVED, Providers

NOW = at(1_000.0)
ON = {"starting_agents.wake_on_message": True}


def started() -> tuple:
    return ("start detached", "t", "codex", tuple(SERVED.given(Providers).driver("codex").AUTO_ARGS), "bea86f27-last")


def ended(n: int, title: str, provider: str, when: float, **more) -> AgentRow:
    return AgentRow(n=n, title=title, data={"event": "SessionEnd", "provider": provider, "at": when, **more})


CONVERSATIONS = [ended(1, "4d863ccb-old", "claude", 100.0), ended(2, "bea86f27-last", "codex", 200.0), ended(3, "claude-20640", "claude", 300.0, event="")]


def session(name: str, environment: str) -> Answering:
    return answering({f".journal/runtime/sessions/{name}/session.json": json.dumps({"environment": environment, "pid": os.getpid()})})


HELD_HERE = session("claude-held", "t")
LAST_ELSEWHERE = session("bea86f27-last", "elsewhere")


def written(by: str, n: int = 1) -> Message:
    return Message(n=n, title="are you there?", seen=[by])


class StartingAgents(Feature):
    details = StartingAgentsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", Launch(), expects=[
            Given((Environments, 1, "bogus")) >> Refused(no_such_agent("bogus")),
            Given(Acted(Environments, "launch", 1, by=AGENT), rows=[Environment(n=1, title="t")]) >> Refused("only the user starts an agent in an environment: they do it from the viewer"),
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
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t", data={"launched": 940.0}), *CONVERSATIONS], settings=ON, clock=NOW)
                >> Dispatches(WakeRequested(environment="t", n=1, provider="codex", conversation="bea86f27-last")),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), ended(2, "ghost-1", "ghost", 200.0)], settings=ON, clock=NOW) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), ended(1, "4d863ccb-old", "claude", 100.0), ended(3, "claude-20640", "claude", 300.0)], settings=ON, clock=NOW)
                >> Dispatches(WakeRequested(environment="t", n=1, provider="claude", conversation="4d863ccb-old")),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t")], settings=ON, clock=NOW) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), ended(2, "bea86f27-last", "codex", 200.0, parent="claude-0")], settings=ON, clock=NOW)
                >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), *CONVERSATIONS], settings=ON, clock=NOW, files=HELD_HERE) >> Dispatches(nothing),
            Given(MessageCreated(n=1, type="message"), rows=[written("user"), Environment(n=1, title="t"), *CONVERSATIONS], settings=ON, clock=NOW, files=LAST_ELSEWHERE) >> Dispatches(nothing),
        ])
        journal.events.handle(WakeRequested, CarryOnTheConversation(), expects=[
            Given(WakeRequested(environment="t", n=1, provider="codex", conversation="bea86f27-last"), rows=[Environment(n=1, title="t")], clock=NOW, processes=answering({started(): 4242}))
                >> Ran(started()) & Updated(Environment(n=1), launched=1_000.0, launched_agent="codex"),
        ])
