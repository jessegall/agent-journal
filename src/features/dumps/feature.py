from events.agents import ClockTicked
from events.messages import MessageUpdated
from expects import WHEN, Dispatches, Given, Nudged, Updated, Wrote, nothing
from framework.base import Feature
from resources.dumps import Dump
from features.dumps.details import DumpsDetails
from resources.dumps import OWN_WORDS
from features.dumps.handlers import (CarryOnFiling, TellChoiceMade, TellChoiceOpen, TellDumpArrived, TellDumpFiled, TellQuestionAnswered, TranscriptToDump)
from features.dumps.listeners import SpotDumpChoosing, SpotDumpFiling, SpotStalledFiling, SpotTranscript
from events.dumps import (DumpArrived, DumpChoiceMade, DumpChoiceOpen, DumpFilingStalled, DumpFiledAway, DumpQuestionAnswered, DumpWritten,
                          TranscriptPasted)
from framework.journal import Journal
from resources.base import SYSTEM, USER
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
        journal.events.listen(DumpWritten, SpotDumpChoosing(), expects=[
            on_arrival(choosing(1, "Keep it"), IDLE) >> Dispatches(DumpChoiceMade(n=1, label="Keep it").once("dump choice|1:5.0")),
            on_arrival(choosing(-1, ""), IDLE) >> Dispatches(DumpChoiceOpen(n=1).once("dump choice|1:5.0")),
            on_arrival(choosing(OWN_WORDS, "my own words"), IDLE) >> Dispatches(nothing),
            on_arrival(dump(), IDLE) >> Dispatches(nothing),
            on_arrival(choosing(1, "Keep it")) >> Dispatches(nothing),
        ])
        journal.events.listen(DumpWritten, SpotDumpFiling(), expects=[
            on_arrival(dump(), IDLE) >> Dispatches(DumpArrived(n=1, items="2 items")),
            on_arrival(dump(items=NOTED), IDLE) >> Dispatches(nothing),
            on_arrival(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"files": {"a.png": ""}}), IDLE) >> Dispatches(nothing),
            on_arrival(dump(), dump(n=2), IDLE) >> Dispatches(nothing),
            on_arrival(choosing(1, "Keep it"), IDLE) >> Dispatches(nothing),
            on_arrival(dump(answers=[{"answer": "Tomorrow", "question": "When should it be done?"}]), IDLE)
                >> Dispatches(DumpQuestionAnswered(n=1, answer="Tomorrow", question="When should it be done?").once("dump answer|1:1")),
            on_completion(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, outcome="2 filed", data={"items": FILED, "files": {"a.png": ""}}), IDLE)
                >> Dispatches(DumpFiledAway(n=1, outcome="2 filed")),
            on_completion(Dump(n=1, title="Notes", brief="Some ideas", completed=WHEN, data={"stopped": True, "files": {"a.png": ""}}), IDLE) >> Dispatches(nothing),
            on_arrival(dump()) >> Dispatches(nothing),
        ])
        journal.events.handle(DumpArrived, TellDumpArrived(), expects=[Given(DumpArrived(n=1, items="2 items"), rows=[IDLE]) >> Nudged("arrived", n=1, count="2 items")])
        journal.events.handle(DumpChoiceMade, TellChoiceMade(), expects=[Given(DumpChoiceMade(n=1, label="Keep it"), rows=[IDLE]) >> Nudged("chose", label="Keep it")])
        journal.events.handle(DumpChoiceOpen, TellChoiceOpen(), expects=[Given(DumpChoiceOpen(n=1), rows=[IDLE]) >> Nudged("decide", n=1)])
        journal.events.handle(DumpQuestionAnswered, TellQuestionAnswered(), expects=[
            Given(DumpQuestionAnswered(n=1, answer="Tomorrow", question="When should it be done?"), rows=[IDLE]) >> Nudged("answered", answer="Tomorrow")])
        journal.events.handle(DumpFiledAway, TellDumpFiled(), expects=[Given(DumpFiledAway(n=1, outcome="2 filed"), rows=[IDLE]) >> Nudged("filed", outcome="2 filed")])
        journal.events.listen(ClockTicked, SpotStalledFiling(), expects=[
            Given.of(ClockTicked(agent=1), dump(), IDLE) >> Dispatches(DumpFilingStalled(n=1, items="2 items").once(f"carried|1:{IDLE.at}")),
            Given.of(ClockTicked(agent=1), dump(), WORKING) >> Dispatches(nothing),
            Given.of(ClockTicked(agent=1), dump(items=FILED), IDLE) >> Dispatches(nothing),
            Given.of(ClockTicked(agent=1), dump(question={"text": "Which project is this for?"}), IDLE) >> Dispatches(nothing),
            Given.of(ClockTicked(agent=1), IDLE) >> Dispatches(nothing),
        ])
        journal.events.handle(DumpFilingStalled, CarryOnFiling(), expects=[Given(DumpFilingStalled(n=1, items="1 item"), rows=[IDLE]) >> Nudged("carry on", n=1, count="1 item")])
        journal.events.listen(MessageUpdated, SpotTranscript(), expects=[
            Given.of(TOUCHED, Message(n=5, title="A pasted conversation", brief="User: hello\nAgent: hi", data={"kind": "transcript"})) >> Dispatches(TranscriptPasted(message=5, actor=USER)),
            Given.of(TOUCHED, Message(n=5, title="A question", brief="Can you look?")) >> Dispatches(nothing),
            Given.of(TOUCHED, Message(n=5, title="A pasted conversation", brief="User: hello", refs=["dump:3"], data={"kind": "transcript"})) >> Dispatches(nothing),
        ])
        journal.events.handle(TranscriptPasted, TranscriptToDump(), expects=[
            Given(TranscriptPasted(message=5, actor=USER), rows=[Message(n=5, title="A pasted conversation", brief="User: hello\nAgent: hi", data={"kind": "transcript"})])
                >> Wrote(Dump(brief="User: hello\nAgent: hi", seen=[USER, SYSTEM])) & Updated(Message(n=5), refs=["dump:1"]),
        ])
