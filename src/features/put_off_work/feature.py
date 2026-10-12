from events.agents import AgentReported
from expects import Given, Unchanged
from resources.types import AgentRow
from framework.base import Feature
from features.put_off_work.details import PutOffWorkDetails
from features.put_off_work.handlers import NameDeferredWork
from framework.journal import Journal


class PutOffWork(Feature):
    details = PutOffWorkDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameDeferredWork(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
