from engine.events.agents import AgentReported
from engine.events.engine import AgentMessageSending, ClockTicked
from engine.events.resources import AnyEvent, QuestionAnswered
import json
from dataclasses import asdict

from expects import answering, Given, Remembered, Kept, Nudged, Refused, Unchanged, Updated
from features.base import Feature
from features.sequences.handlers import TriggerFired
from features.sequences.resource import Sequence
from features.trigger import Mark
from features.triggers.resource import Trigger
from providers.payload import BashCall
from resources.base import USER
from resources.types import AgentRow, Question
from features.journal import Journal
from features.sending import Nudge
from features.sequences.controller import Sequences
from features.sequences.details import SequencesDetails
from features.triggers.controller import STARTED_BY
from features.sequences.details import UNFINISHED
from features.sequences.shipped import SEQUENCES
from features.sequences.handlers import (DispatchAgainOnAnswer, EndWithItsRow, HandStepToAgent, HoldAStalledStep, HoldJournalWritesForTheStep, KeepOutOfTheChat,
                                         ReleaseStaleStep, ResetEditsOnStep, SequenceMoved, StartOnMoment, StartOnTrigger, standing_steps, step_pace)

__all__ = ["Sequences"]


def release(step: int = 1, **run) -> Sequence:
    return Sequence(n=4, title="Cutting a patch release", sections=[{"title": "Tag it", "body": "Run journal version tag to cut the tag."}],
                    data={"runs": {"t|by hand": {"step": step, "at": 1.0, **run}}})


AFTER_SEVEN_EDITS = {".journal/runtime/sessions/claude-1/trigger-sequences.json": json.dumps(asdict(Mark(edits=7)))}

AGENT_ROW = AgentRow(n=1, title="claude-1")
MOVED = SequenceMoved(n=4, type="sequence", action="updated", actor=USER)


def talking(place: str = "the viewer") -> Sequence:
    return Sequence(n=4, title="Writing an update", sections=[{"title": "Write it", "body": "Write the update."}],
                    data={"talks_in": place, "runs": {"t|by hand": {"step": 1, "at": 1.0}}})


def sending(text: str) -> AgentMessageSending:
    return AgentMessageSending(agent=1, data={"text": text, "turn": "turn-1"})


def on_creating(starts_on: str, **data) -> Sequence:
    return Sequence(n=4, title="Triage a to-do", sections=[{"title": "Look", "body": "Read it."}], data={"starts_on": starts_on, **data})


class AtStepOne:
    def __eq__(self, run) -> bool:
        return run["step"] == 1


def todo(action: str, actor: str = USER) -> AnyEvent:
    return AnyEvent(n=5, type="todo", action=action, actor=actor)


def shell(command: str) -> BashCall:
    return BashCall.from_payload("Bash", {"command": command}, {})


class SequencesFeature(Feature):
    details = SequencesDetails
    nudges = (Nudge(UNFINISHED, behaviour=UNFINISHED, about=standing_steps, private=False, pace=step_pace,
                    guarantee="While a sequence stands at a step, the agent is told which step it is on until it moves on or gives the sequence up."),)
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        STARTED_BY.add(None, Sequences)
        journal.events.handler(StartOnMoment(), expects=[
            Given(todo("created"), rows=[on_creating("todo.created")]) >> Updated(Sequence(n=4), runs={"t|todo:5": AtStepOne()}),
            Given(todo("created"), rows=[on_creating("plan.created")]) >> Unchanged(),
            Given(AnyEvent(n=4, type="sequence", action="created", actor=USER), rows=[on_creating("sequence.created")]) >> Unchanged(),
            Given(todo("created"), rows=[on_creating("todo.created", started_by="agent")]) >> Unchanged(),
            Given(todo("created"), rows=[on_creating("todo.created", only_when_idle=True), release()]) >> Unchanged(),
            Given(todo("renamed"), rows=[on_creating("todo.created")]) >> Unchanged(),
        ])
        journal.events.handler(StartOnTrigger(), expects=[
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "start", "words": ["triage"]}), on_creating("trigger:2")])
                >> Updated(Sequence(n=4), runs={"t|message:7": AtStepOne()}),
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "nudge", "words": ["triage"]}), on_creating("trigger:2")]) >> Unchanged(),
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "start", "words": ["triage"]}), on_creating("trigger:3")]) >> Unchanged(),
        ])
        journal.events.handler(DispatchAgainOnAnswer(), expects=[
            Given(QuestionAnswered(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main"), AGENT_ROW]) >> Unchanged(),
            Given(QuestionAnswered(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main", refs=["board:2"]), AGENT_ROW]) >> Unchanged(),
            Given(QuestionAnswered(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main", refs=["board:2"])]) >> Unchanged(),
        ])
        journal.agent.interceptor(HoldJournalWritesForTheStep(), expects=[
            Given(shell('journal todo create "Later"'), rows=[release()]) >> Refused("sequence 4, Cutting a patch release, handed you step 1 - take it up with journal sequence follow 4 before any other write - then do what the step says and journal sequence next 4"),
            Given(shell('journal todo create "Later"'), rows=[release(followed=1)]) >> Kept(),
            Given(shell('journal todo create "Later"')) >> Kept(),
            Given(shell("journal version tag"), rows=[release()]) >> Kept(),
            Given(shell("journal todo show 3"), rows=[release()]) >> Kept(),
            Given(shell("journal sequence next 4"), rows=[release()]) >> Kept(),
            Given(shell("git status"), rows=[release()]) >> Kept(),
        ])
        journal.events.handler(EndWithItsRow(), expects=[
            Given(todo("deleted"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:5": {"step": 1, "at": 1.0}}})]) >> Updated(Sequence(n=4), runs={}),
            Given(todo("deleted"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:6": {"step": 1, "at": 1.0}}})]) >> Unchanged(),
            Given(todo("completed"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:5": {"step": 1, "at": 1.0}}})]) >> Unchanged(),
        ])
        journal.events.handler(HandStepToAgent(), expects=[
            Given(MOVED, rows=[release(), AGENT_ROW]) >> Nudged("step"),
            Given(MOVED, rows=[release(followed=1), AGENT_ROW]) >> Unchanged(),
            Given(SequenceMoved(n=4, type="sequence", action="deleted", actor=USER), rows=[AGENT_ROW]) >> Unchanged(),
            Given(MOVED, rows=[release()]) >> Unchanged(),
        ])
        journal.events.handler(HoldAStalledStep(), expects=[
            Given(AgentReported(agent=1), rows=[release(followed=1), AGENT_ROW]) >> Unchanged(),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"wrote": True})]) >> Unchanged(),
        ])
        journal.events.handler(ResetEditsOnStep(), expects=[
            Given(MOVED, rows=[release(), AGENT_ROW], files=answering(AFTER_SEVEN_EDITS)) >> Remembered("trigger-sequences", asdict(Mark(edits=0))),
            Given(todo("created"), rows=[AGENT_ROW], files=answering(AFTER_SEVEN_EDITS)) >> Remembered("trigger-sequences", asdict(Mark(edits=7))),
        ])
        journal.events.handler(ReleaseStaleStep(), expects=[
            Given(ClockTicked(agent=1), rows=[release(), AGENT_ROW]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(KeepOutOfTheChat(), expects=[
            Given(sending("Here is the update."), rows=[talking(), AGENT_ROW]) >> Nudged("in_chat"),
            Given(sending("Here is the update."), rows=[talking(""), AGENT_ROW]) >> Unchanged(),
            Given(sending("   "), rows=[talking(), AGENT_ROW]) >> Unchanged(),
            Given(sending("Here is the update."), rows=[AGENT_ROW]) >> Unchanged(),
        ])
