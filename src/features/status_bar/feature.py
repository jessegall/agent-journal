from controllers.types import Agents
from events.agents import AgentReported
from events.status_bar import BarStale, DoingStale, UsageRead
from expects import Answered, Dispatches, Given, Remembered, Updated, nothing
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow
from features.status_bar.details import StatusLineDetails
from features.status_bar.handlers import BAR_EVERY, DrawTheBar, KeepUsage, NoteWhatItDoes, ReadUsage, SpotStaleBar, SpotStaleDoing
from features.status_bar.commands import ShowBar
from features.status_bar.routes import get_bar


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_bar)
        journal.commands.add("agent", ShowBar(), expects=[Given((Agents,)) >> Answered({"queue": []})])
        journal.events.listen(AgentReported, SpotStaleBar(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(BarStale(agent=1).spaced("bar", BAR_EVERY)),
        ])
        journal.events.handle(BarStale, DrawTheBar(), expects=[
            Given(BarStale(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("bar", {"queue": []}),
        ])
        journal.events.listen(AgentReported, SpotStaleDoing(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Dispatches(DoingStale(agent=1).spaced("doing|1", BAR_EVERY)),
        ])
        journal.events.handle(DoingStale, NoteWhatItDoes(), expects=[
            Given(DoingStale(agent=1), rows=[AgentRow(n=1, data={"doing": "Reading orchestra.js"})]) >> Updated(AgentRow(n=1), doing=""),
        ])
        journal.events.listen(AgentReported, ReadUsage(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
        ])
        journal.events.handle(UsageRead, KeepUsage(), expects=[
            Given(UsageRead(agent=1, usage={"tokens": 1200}), rows=[AgentRow(n=1)]) >> Updated(AgentRow(n=1), usage={"tokens": 1200}),
        ])
