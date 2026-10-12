from events.agents import ClockTicked
from expects import Given, Unchanged, Updated, WHEN
from features.base import Feature
from features.journal import Journal
from features.auto_archive.details import AutoArchiveDetails
from features.auto_archive.handlers import ExpireOldRows
from resources.types import AgentRow, Report, Todo

DAY = 24 * 3600
AGENT_ROW = AgentRow(n=1, title="claude-1")
TICK = ClockTicked(agent=1)


class AutoArchive(Feature):
    details = AutoArchiveDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ExpireOldRows(), expects=[
            Given(TICK, rows=[Report(n=1, title="Audit", created=WHEN - 15 * DAY), AGENT_ROW]) >> Updated(Report(n=1), outcome="aged out after 14 days"),
            Given(TICK, rows=[Report(n=1, title="Audit", created=WHEN - 13 * DAY), AGENT_ROW]) >> Unchanged(),
            Given(TICK, rows=[Report(n=1, title="Audit", created=WHEN - 15 * DAY, completed=WHEN - 14 * DAY), AGENT_ROW]) >> Unchanged(),
            Given(TICK, rows=[Todo(n=2, title="Old row", completed=WHEN - 8 * DAY), AGENT_ROW]) >> Updated(Todo(n=2), deleted=WHEN),
            Given(TICK, rows=[Todo(n=2, title="Recent row", completed=WHEN - 6 * DAY), AGENT_ROW]) >> Unchanged(),
            Given(TICK, rows=[Todo(n=2, title="Open old row", created=WHEN - 30 * DAY), AGENT_ROW]) >> Unchanged(),
        ])
