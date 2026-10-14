from events import Fact
from events.agents import AgentReported
from events.catching_up import Compacting
from payload import HookEvent
from receiving import Handler, Listener
from serving import Chat, Settings


class SpotCompaction(Listener[AgentReported]):
    def listen(self, event: AgentReported) -> list[Fact]:
        return [Compacting(agent=event.agent)] if event.hook == HookEvent.PRE_COMPACT else []


class HoldUntilCaughtUp(Handler[Compacting]):
    def handle(self, event: Compacting, chat: Chat, settings: Settings) -> list[Fact]:
        chat.hold("read held", count=settings.count)
        return []
