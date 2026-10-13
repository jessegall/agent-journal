from events import Fact
from events.agents import AgentReported
from events.status_bar import BarStale, DoingStale, UsageRead
from features.status_bar.bar import bar, doing
from resources.status_bar import EMPTY
from features.status_bar.usage import observe
from receiving import Handler, Listener
from resources.types import AgentRow
from serving import Clock, ReadRows, Remembered, Rows, Settings

BAR_EVERY = 1.0
USAGE = "usage"


class SpotStaleBar(Listener[AgentReported]):
    """A person reads the bar about once a second, so it is drawn at most that often, the latest state winning."""

    def listen(self, event: AgentReported) -> list[Fact]:
        return [BarStale(agent=event.agent).spaced("bar", BAR_EVERY)]


class SpotStaleDoing(Listener[AgentReported]):
    def listen(self, event: AgentReported) -> list[Fact]:
        return [DoingStale(agent=event.agent).spaced(f"doing|{event.agent}", BAR_EVERY)]


class ReadUsage(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], settings: Settings) -> list[Fact]:
        if not settings.is_on(USAGE):
            return []
        row = agents.peek(event.agent)
        usage = observe(row.provider, row.transcript, row.usage)
        return [UsageRead(agent=event.agent, usage=usage)] if usage is not None and usage != row.usage else []


class DrawTheBar(Handler[BarStale]):
    def handle(self, event: BarStale, agents: ReadRows[AgentRow], memory: Remembered, clock: Clock) -> list[Fact]:
        newest = agents.primary_to_read()
        drawn = bar(newest, clock.now()) if newest else EMPTY
        if memory.get("bar") != drawn:
            memory.set("bar", drawn)
        return []


class NoteWhatItDoes(Handler[DoingStale]):
    """The agent's own row keeps the bar's plain line for its latest activity, which the Home cells show in place of a tool name."""

    def handle(self, event: DoingStale, agents: Rows[AgentRow], clock: Clock) -> list[Fact]:
        row = agents.peek(event.agent)
        line = doing(row, clock.now())
        if line != row.doing:
            agents.update(row.n, doing=line)
        return []


class KeepUsage(Handler[UsageRead]):
    def handle(self, event: UsageRead, agents: Rows[AgentRow]) -> list[Fact]:
        agents.update(event.agent, usage=event.usage)
        return []
