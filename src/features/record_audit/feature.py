from events.agents import ClockTicked
from events.record_audit import EvidenceFound
from expects import Dispatches, Given, Nudged, nothing
from framework.base import Feature
from features.record_audit.details import RecordAuditDetails
from features.record_audit.handlers import SayEvidence
from features.record_audit.listeners import SpotEvidence
from framework.journal import Journal
from resources.types import AgentRow, Rule


AGENT_ROW = AgentRow(n=1, title="claude-1")
BOGUS = EvidenceFound(count="1 thing", found='rule:2 names journal bogus, which the CLI does not answer to — journal rule 2 strike "<why>"')


class RecordAudit(Feature):
    details = RecordAuditDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, SpotEvidence(), expects=[
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal bogus` first"), AGENT_ROW]) >> Dispatches(BOGUS),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal todo create` first"), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Never skip the gate"), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(EvidenceFound, SayEvidence(), expects=[
            Given(BOGUS, rows=[AGENT_ROW]) >> Nudged("evidence", count="1 thing"),
        ])
