from events.agents import ClockTicked
from expects import Given, Nudged, Unchanged
from features.base import Feature
from features.record_audit.details import RecordAuditDetails
from features.record_audit.handlers import SayEvidence
from features.journal import Journal
from resources.types import AgentRow, Rule


AGENT_ROW = AgentRow(n=1, title="claude-1")


class RecordAudit(Feature):
    details = RecordAuditDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(SayEvidence(), expects=[
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal bogus` first"), AGENT_ROW]) >> Nudged("evidence"),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal todo create` first"), AGENT_ROW]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Never skip the gate"), AGENT_ROW]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
