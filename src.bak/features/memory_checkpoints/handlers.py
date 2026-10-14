from events import Fact
from events.memory_checkpoints import AgentKeptSomething, ContextDecided, ContextMarkReached
from receiving import Handler
from resources.types import AgentRow
from serving import Chat, Rows


class HoldUntilDecided(Handler[ContextMarkReached]):
    def handle(self, event: ContextMarkReached, chat: Chat) -> list[Fact]:
        chat.hold("decide held", percent=event.percent)
        chat.say("decide", percent=event.percent)
        return []


class ReleaseOnceDecided(Handler[ContextDecided]):
    def handle(self, event: ContextDecided, chat: Chat) -> list[Fact]:
        chat.release()
        return []


class MarkWhatWasKept(Handler[AgentKeptSomething]):
    def handle(self, event: AgentKeptSomething, agents: Rows[AgentRow]) -> list[Fact]:
        agents.card(event.agent, label=event.label, icon=event.icon, detail=event.detail, ref=event.ref)
        return []
