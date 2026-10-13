from events import Fact
from events.agents import ClockTicked
from events.record_audit import EvidenceFound
from features.record_audit.audit import claim_evidence, waiting_evidence
from receiving import Listener
from resources.text import plural
from resources.types import Fact as FactRow, Question, Reminder, Rule, Todo
from serving import Clock, ReadFiles, ReadRows


class SpotEvidence(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, rules: ReadRows[Rule], facts: ReadRows[FactRow], reminders: ReadRows[Reminder], questions: ReadRows[Question],
               todos: ReadRows[Todo], files: ReadFiles, clock: Clock) -> list[Fact]:
        found = claim_evidence((rules, facts, reminders), files) + waiting_evidence(questions, todos, clock.now())
        if not found:
            return []
        return [EvidenceFound(count=plural(len(found), "thing"), found="; ".join(f"{f.ref} {f.evidence} — {f.retire}" for f in found))]
