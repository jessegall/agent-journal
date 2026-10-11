import time

from controllers.types import Messages
from engine.events.agents import AgentReported
from expects import Answered, Given, Held
from features.base import Feature
from features.catching_up.commands import Recent
from features.catching_up.details import CatchingUpDetails
from features.catching_up.handlers import HoldUntilCaughtUp
from features.journal import Journal
from resources.types import AgentRow, Message

WRITTEN = 1_000_000.0
WHEN = time.strftime("%Y-%m-%d %H:%M", time.localtime(WRITTEN))


def read_held(count: int) -> str:
    return f"the conversation was compacted — read the latest {count} messages before any other write — journal message recent"


class CatchingUp(Feature):
    details = CatchingUpDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("message", Recent(), expects=[
            Given((Messages,)) >> Answered("no messages yet"),
            Given((Messages,), rows=[Message(n=5, title="look at the header", brief="please look at the header", seen=["user"], created=WRITTEN),
                                     Message(n=6, title="done", brief="the header is fixed", seen=["agent"], created=WRITTEN)])
                >> Answered(f"message 5 · the user · {WHEN}\nplease look at the header\n\nmessage 6 · you · {WHEN}\nthe header is fixed"),
            Given((Messages,), rows=[Message(n=5, title="one", seen=["user"], created=WRITTEN), Message(n=6, title="two", seen=["user"], created=WRITTEN)],
                  settings={"catching_up.count": 1})
                >> Answered(f"message 6 · the user · {WHEN}\ntwo"),
        ])
        journal.events.handler(HoldUntilCaughtUp(), expects=[
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1)]) >> Held(read_held(50)),
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1)], settings={"catching_up.count": 10}) >> Held(read_held(10)),
        ])
