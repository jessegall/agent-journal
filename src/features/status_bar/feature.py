from controllers.types import Agents
from events.agents import AgentReported
from expects import Answered, Given, Remembered, Unchanged, Updated
from features.base import Feature
from features.journal import Journal
from resources.types import AgentRow
from features.status_bar.details import StatusLineDetails
from features.status_bar.handlers import RecordWhatItDoes, RefreshUsage, WriteBar
from features.status_bar.commands import ShowBar
from features.status_bar.routes import get_bar


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_bar)
        journal.commands.add("agent", ShowBar(), expects=[Given((Agents,)) >> Answered({"queue": []})])
        journal.events.handler(WriteBar(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged() & Remembered("bar", {"queue": []}),
        ])
        journal.events.handler(RecordWhatItDoes(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, data={"doing": "Reading orchestra.js"})]) >> Updated(AgentRow(n=1), doing=""),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(RefreshUsage(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
