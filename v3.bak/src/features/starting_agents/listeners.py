from events import Fact
from events.messages import MessageCreated
from events.starting_agents import WakeRequested
from receiving import Listener
from resources.base import USER
from resources.types import AgentRow, Message
from serving import Clock, Providers, ReadElsewhere, ReadRows, ReadSessions, Settings

LAUNCHING_FOR = 60.0


def last_conversation(agents: ReadRows[AgentRow], providers: Providers):
    rows = [row for row in agents.rows.every()
            if row.data.get("event") and providers.knows(row.provider) and not row.subagent and not row.title.startswith(f"{row.provider}-")]
    return max(rows, key=lambda row: float(row.at), default=None)


class SpotMessageToWake(Listener[MessageCreated]):
    def listen(self, event: MessageCreated, settings: Settings, messages: ReadRows[Message], agents: ReadRows[AgentRow], sessions: ReadSessions,
               providers: Providers, elsewhere: ReadElsewhere, clock: Clock) -> list[Fact]:
        if not settings.wake_on_message or messages.load(event.n).seen[:1] != [USER]:
            return []
        here = elsewhere.here()
        place = here.place()
        if sessions.holder(here.record.env) or place is None or clock.now() - float(place.launched) < LAUNCHING_FOR:
            return []
        last = last_conversation(agents, providers)
        if last is None or sessions.is_live(last.title):
            return []
        return [WakeRequested(environment=place.title, n=place.n, provider=last.provider, conversation=last.title)]
