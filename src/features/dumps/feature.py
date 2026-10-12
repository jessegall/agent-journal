import features.dumps.controller  # noqa: F401
from events.agents import ClockTicked
from events.messages import MessageUpdated
from expects import WHEN, Given, Nudged, Unchanged, Updated, Wrote
from features.base import Feature
from features.dumps.resource import Dump
from features.dumps.details import DumpsDetails
from features.dumps.controller import OWN_WORDS
from features.dumps.handlers import CarryOnFiling, PromptFiling, TranscriptToDump
from events.dumps import DumpWritten
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


def choosing(pick: int, label: str) -> Dump:
    return dump(chosen={"at": 5.0, "pick": pick, "label": label})


def on_arrival(*rows) -> Given:
    return Given.of(arrived(), *rows)


def on_completion(*rows) -> Given:
    return Given.of(arrived("completed"), *rows)


class DumpsFeature(Feature):
    details = DumpsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PromptFiling(), expects=[
            on_arrival(dump(), IDLE) >> Nudged("arrived"),
            on_arrival(dump(items=NOTED), IDLE) >> Unchanged(),
            on_arrival(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"files": {"a.png": ""}}), IDLE) >> Unchanged(),
            on_arrival(dump(), dump(n=2), IDLE) >> Unchanged(),
            on_arrival(choosing(1, "Keep it"), IDLE) >> Nudged("chose", label="Keep it"),
            on_arrival(choosing(-1, ""), IDLE) >> Nudged("decide"),
            on_arrival(choosing(OWN_WORDS, "my own words"), IDLE) >> Unchanged(),
            on_arrival(dump(answers=[{"answer": "Tomorrow", "question": "When should it be done?"}]), IDLE) >> Nudged("answered", answer="Tomorrow"),
            on_completion(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, outcome="2 filed", data={"items": FILED, "files": {"a.png": ""}}), IDLE) >> Nudged("filed"),
            on_completion(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"stopped": True, "files": {"a.png": ""}}), IDLE) >> Unchanged(),
            on_arrival(dump()) >> Unchanged(),
        ])
        journal.events.handler(CarryOnFiling(), expects=[
            Given.of(ClockTicked(agent=1), dump(), IDLE) >> Nudged("carry on"),
            Given.of(ClockTicked(agent=1), dump(), WORKING) >> Unchanged(),
            Given.of(ClockTicked(agent=1), dump(items=FILED), IDLE) >> Unchanged(),
            Given.of(ClockTicked(agent=1), dump(question={"text": "Which project is this for?"}), IDLE) >> Unchanged(),
            Given.of(ClockTicked(agent=1), IDLE) >> Unchanged(),
        ])
        journal.events.handler(TranscriptToDump(), expects=[
            Given.of(TOUCHED, Message(n=5, title="A pasted conversation", brief="User: hello\nAgent: hi", data={"kind": "transcript"}))
                >> Wrote(Dump(brief="User: hello\nAgent: hi")) & Updated(Message(n=5), refs=["dump:1"]),
            Given.of(TOUCHED, Message(n=5, title="A question", brief="Can you look?")) >> Unchanged(),
            Given.of(TOUCHED, Message(n=5, title="A pasted conversation", brief="User: hello", refs=["dump:3"], data={"kind": "transcript"})) >> Unchanged(),
        ])
