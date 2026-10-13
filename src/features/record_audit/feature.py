from events.agents import ClockTicked
from events.record_audit import EvidenceFound
from expects import Dispatches, Given, Nudged, answering, at, nothing
from framework.base import Feature
from features.record_audit.details import RecordAuditDetails
from features.record_audit.handlers import SayEvidence
from features.record_audit.listeners import SpotEvidence
from framework.journal import Journal
from resources.types import AgentRow, Fact, Question, Rule, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
BOGUS = EvidenceFound(count="1 thing", found='rule:2 names journal bogus, which the CLI does not answer to — journal rule 2 strike "<why>"')


OTHER = answering({"docs/other.md": ""})
WORDS = answering({("nouns",): {"todo": {"create"}}})


def gone(ref: str, kind: str, n: int, path: str = "docs/gone.md") -> str:
    return f'{ref}:{n} names {path}, which is gone — journal {kind} {n} strike "<why>"'


class RecordAudit(Feature):
    details = RecordAuditDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, SpotEvidence(), expects=[
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal bogus` first"), AGENT_ROW]) >> Dispatches(BOGUS),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal todo create` first"), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Never skip the gate"), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Notes live in docs/gone.md"), AGENT_ROW], files=OTHER)
                >> Dispatches(EvidenceFound(count="1 thing", found=gone("rule", "rule", 2))),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Mind the gate", brief="See docs/gone.md"), AGENT_ROW], files=OTHER)
                >> Dispatches(EvidenceFound(count="1 thing", found=gone("rule", "rule", 2))),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Notes live in docs/other.md"), AGENT_ROW], files=OTHER) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Fact(n=3, title="Config lives in docs/gone.md"), AGENT_ROW], files=OTHER)
                >> Dispatches(EvidenceFound(count="1 thing", found=gone("fact", "fact", 3))),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Notes live in docs/gone.md", completed=9.0), AGENT_ROW], files=OTHER) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Always use `journal todo bogus` first"), AGENT_ROW], command_words=WORDS)
                >> Dispatches(EvidenceFound(count="1 thing", found='rule:2 names journal todo bogus, which the CLI does not answer to — journal rule 2 strike "<why>"')),
            Given(ClockTicked(agent=1), rows=[Rule(n=2, title="Run `journal bogus` and edit docs/gone.md"), AGENT_ROW], files=OTHER, command_words=WORDS)
                >> Dispatches(EvidenceFound(count="2 things", found=gone("rule", "rule", 2) + '; rule:2 names journal bogus, which the CLI does not answer to — journal rule 2 strike "<why>"')),
            Given(ClockTicked(agent=1), rows=[Todo(n=1, title="Ship the footer"), Question(n=3, title="Which footer?", refs=["todo:1"], created=100.0), AGENT_ROW], clock=at(1_000_000.0))
                >> Dispatches(EvidenceFound(count="1 thing", found='todo:1 waiting on the user for over 7 days (question 3) — journal todo 1 done "<why>"')),
            Given(ClockTicked(agent=1), rows=[Todo(n=1, title="Ship the footer"), Question(n=3, title="Which footer?", refs=["todo:1"], created=900_000.0), AGENT_ROW], clock=at(1_000_000.0))
                >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Todo(n=1, title="Ship the footer"), Question(n=3, title="Which footer?", refs=["todo:1"], created=100.0, completed=500.0), AGENT_ROW], clock=at(1_000_000.0))
                >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Todo(n=1, title="Ship the footer"), Question(n=3, title="Which footer?", refs=["todo:2"], created=100.0), AGENT_ROW], clock=at(1_000_000.0))
                >> Dispatches(nothing),
        ])
        journal.events.handle(EvidenceFound, SayEvidence(), expects=[
            Given(BOGUS, rows=[AGENT_ROW]) >> Nudged("evidence", count="1 thing"),
        ])
