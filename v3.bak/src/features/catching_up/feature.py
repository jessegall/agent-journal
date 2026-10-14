import time

from controllers.types import Messages
from events.agents import AgentReported
from events.catching_up import Compacting
from expects import Answered, Dispatches, Given, Held, Released, nothing
from framework.base import Feature
from features.catching_up.commands import Recent
from features.catching_up.details import CatchingUpDetails
from features.catching_up.handlers import HoldUntilCaughtUp, SpotCompaction
from framework.journal import Journal
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
            Given((Messages,), rows=[Message(n=5, title="merge", brief="Merge the pull requests\ninto main, within the hour", seen=["user"], created=WRITTEN)])
                >> Answered(f"message 5 · the user · {WHEN}\nMerge the pull requests\ninto main, within the hour"),
            Given((Messages,), rows=[Message(n=5, title="an answered question", seen=["user"], created=WRITTEN, completed=WRITTEN),
                                     Message(n=6, title="a message taken back", seen=["user"], created=WRITTEN, deleted=WRITTEN)])
                >> Answered(f"message 5 · the user · {WHEN}\nan answered question"),
            Given((Messages,), rows=[AgentRow(n=1, title="claude-1")], held=read_held(50)) >> Answered("no messages yet") & Released(),
            Given((Messages,), rows=[AgentRow(n=1, title="claude-1"), Message(n=5, title="what you were doing", seen=["user"], created=WRITTEN)], held=read_held(50))
                >> Answered(f"message 5 · the user · {WHEN}\nwhat you were doing") & Released(),
        ])
        journal.events.listen(AgentReported, SpotCompaction(), expects=[
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1)]) >> Dispatches(Compacting(agent=1)),
            Given(AgentReported(agent=1, hook="PostToolUse"), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
        ])
        journal.events.handle(Compacting, HoldUntilCaughtUp(), expects=[
            Given(Compacting(agent=1), rows=[AgentRow(n=1)]) >> Held(read_held(50)),
            Given(Compacting(agent=1), rows=[AgentRow(n=1)], settings={"catching_up.count": 10}) >> Held(read_held(10)),
        ])
