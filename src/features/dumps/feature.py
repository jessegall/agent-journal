import features.dumps.controller  # noqa: F401
from engine.events.engine import ClockTicked
from engine.events.resources import MessageUpdated
from expects import WHEN, Given, Nudged, Unchanged, Updated, Wrote
from features.base import Feature
from features.dumps.resource import Dump
from features.dumps.details import DumpsDetails
from features.dumps.controller import OWN_WORDS
from features.dumps.handlers import CarryOnFiling, DumpWritten, PromptFiling, TranscriptToDump
from features.journal import Journal
from resources.base import USER
from resources.types import AgentRow, Message

TOUCHED = MessageUpdated(n=5, type="message", action="updated", actor=USER, numbers=(5,))

IDLE = AgentRow(n=1, title="claude-1", data={"status": "idle"})
WORKING = AgentRow(n=1, title="claude-1", data={"status": "working"})
NOTED = {"text": {"insight": "a list of ideas"}, "a.png": {"insight": "a screenshot"}}
FILED = {"text": {"outcome": "filed as to-do 4"}, "a.png": {"outcome": "attached to doc 2"}}


def arrived(action: str = "created") -> DumpWritten:
    return DumpWritten(n=1, type="dump", action=action, actor=USER)


def dump(n: int = 1, **data) -> Dump:
    return Dump(n=n, title="Notes", brief="Some ideas", created=WHEN - 10 * n, data={"files": {"a.png": ""}, **data})


class DumpsFeature(Feature):
    details = DumpsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PromptFiling(), expects=[
            Given(arrived(), rows=[dump(), IDLE]) >> Nudged("arrived"),
            Given(arrived(), rows=[dump(items=NOTED), IDLE]) >> Unchanged(),
            Given(arrived(), rows=[Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"files": {"a.png": ""}}), IDLE]) >> Unchanged(),
            Given(arrived(), rows=[dump(), dump(n=2), IDLE]) >> Unchanged(),
            Given(arrived(), rows=[dump(chosen={"at": 5.0, "pick": 1, "label": "Keep it"}), IDLE]) >> Nudged("chose", label="Keep it"),
            Given(arrived(), rows=[dump(chosen={"at": 5.0, "pick": -1, "label": ""}), IDLE]) >> Nudged("decide"),
            Given(arrived(), rows=[dump(chosen={"at": 5.0, "pick": OWN_WORDS, "label": "my own words"}), IDLE]) >> Unchanged(),
            Given(arrived(), rows=[dump(answers=[{"answer": "Tomorrow", "question": "When should it be done?"}]), IDLE]) >> Nudged("answered", answer="Tomorrow"),
            Given(arrived("completed"), rows=[Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, outcome="2 filed", data={"items": FILED, "files": {"a.png": ""}}), IDLE]) >> Nudged("filed"),
            Given(arrived("completed"), rows=[Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"stopped": True, "files": {"a.png": ""}}), IDLE]) >> Unchanged(),
            Given(arrived(), rows=[dump()]) >> Unchanged(),
        ])
        journal.events.handler(CarryOnFiling(), expects=[
            Given(ClockTicked(agent=1), rows=[dump(), IDLE]) >> Nudged("carry on"),
            Given(ClockTicked(agent=1), rows=[dump(), WORKING]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[dump(items=FILED), IDLE]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[dump(question={"text": "Which project is this for?"}), IDLE]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[IDLE]) >> Unchanged(),
        ])
        journal.events.handler(TranscriptToDump(), expects=[
            Given(TOUCHED, rows=[Message(n=5, title="A pasted conversation", brief="User: hello\nAgent: hi", data={"kind": "transcript"})])
                >> Wrote(Dump(brief="User: hello\nAgent: hi")) & Updated(Message(n=5), refs=["dump:1"]),
            Given(TOUCHED, rows=[Message(n=5, title="A question", brief="Can you look?")]) >> Unchanged(),
            Given(TOUCHED, rows=[Message(n=5, title="A pasted conversation", brief="User: hello", refs=["dump:3"], data={"kind": "transcript"})]) >> Unchanged(),
        ])
