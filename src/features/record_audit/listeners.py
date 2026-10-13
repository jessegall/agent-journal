from events import Fact
from events.record_audit import EvidenceDue, EvidenceFound
from features.record_audit.audit import claim_evidence, waiting_evidence
from receiving import Listener
from resources.text import plural
from resources.types import Fact as FactRow, Question, Reminder, Rule, Todo
from serving import Clock, CommandWords, ReadFiles, ReadRows


class SpotEvidence(Listener[EvidenceDue]):
    def listen(self, event: EvidenceDue, rules: ReadRows[Rule], facts: ReadRows[FactRow], reminders: ReadRows[Reminder], questions: ReadRows[Question],
               todos: ReadRows[Todo], files: ReadFiles, command_words: CommandWords, clock: Clock) -> list[Fact]:
        found = claim_evidence((rules, facts, reminders), files, command_words) + waiting_evidence(questions, todos, clock.now())
        if not found:
            return []
        return [EvidenceFound(count=plural(len(found), "thing"), found="; ".join(f"{f.ref} {f.evidence} — {f.retire}" for f in found))]
