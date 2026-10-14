import json
from expects.calls import shell_answered, shell_asked
from dataclasses import asdict, replace

from events.agents import AgentTurnWritten, ClockTicked, ToolCallAnswered, ToolFinished
from events.answers import Allowed, Kept as Silenced, Refused as Declined
from events.asking import AgentMessageSending, ToolCallAsked
from events.questions import QuestionCompleted
from events.resources import AnyEvent
from events.sequences import SequenceMoved
from events.sequences_run import (DispatchDue, RunEnded, SequenceStarts, StepCountRestarted, StepEdited, StepFollowed, StepHeld, StepStalled, StepTakenUp, StepToSay,
                                  TalkKeptOut)
from events.triggers import TriggerFired
from expects import WHEN, Answered, Dispatches, Given, Held, Nudged, Released, Remembered, Reported, Ticked, Told, Unchanged, Updated, answering, nothing
from controllers.types import Sequences
from declaring.trigger import Mark
from features.sequences.answering import HoldJournalWritesForTheStep, KeepOutOfTheChat
from features.sequences.details import STEP_HELD, STEP_STALLED, UNFINISHED, SequencesDetails
from features.sequences.handlers import (CountTheEdit, CountTheEditsAfresh, DropTheRun, FollowTheStep, HoldTheAgentToTheStep, HoldTheStalledStep, LetTheAgentGo,
                                         NameTheChatRule, RunTheSequence, TellTheDispatch, TellTheStep)
from features.sequences.listeners import (SpotNoStepInHand, SpotQuestionToDispatchAgain, SpotRunOfADeletedRow, SpotSequenceChange, SpotSequenceToStartOnMoment,
                                          SpotSequenceToStartOnTrigger, SpotStepFollowed, SpotStepStandingThroughWrites, SpotStepToHand, SpotTalkInChat)
from features.sequences.shipped import SEQUENCES
from features.sequences.steps import standing_steps, step_held_text, step_pace
from framework.base import Feature
from framework.journal import Journal
from framework.sending import Nudge
from resources.base import AGENT, USER
from resources.sequences import Sequence
from resources.triggers import STARTED_BY, Trigger
from resources.types import AgentRow, Question, Todo
from serving import SERVED, Providers

__all__ = ["Sequences"]


def release(step: int = 1, **run) -> Sequence:
    return Sequence(n=4, title="Cutting a patch release", sections=[{"title": "Tag it", "body": "Run journal version tag to cut the tag."}],
                    data={"runs": {"t|by hand": {"step": step, "at": 1.0, **run}}})


AFTER_SEVEN_EDITS = {".journal/runtime/sessions/claude-1/trigger-sequences.json": json.dumps(asdict(Mark(edits=7)))}

AGENT_ROW = AgentRow(n=1, title="claude-1")


def handed(at: float) -> Sequence:
    return Sequence(n=4, title="Cutting a patch release", sections=[{"title": "Tag it", "body": "Run journal version tag to cut the tag."}],
                    data={"runs": {"t|by hand": {"step": 1, "at": at}}})
MOVED = SequenceMoved(n=4, type="sequence", action="updated", actor=USER)


def talking(place: str = "the viewer") -> Sequence:
    return Sequence(n=4, title="Writing an update", sections=[{"title": "Write it", "body": "Write the update."}],
                    data={"talks_in": place, "runs": {"t|by hand": {"step": 1, "at": 1.0}}})


def on_creating(starts_on: str, **data) -> Sequence:
    return Sequence(n=4, title="Triage a to-do", sections=[{"title": "Look", "body": "Read it."}], data={"starts_on": starts_on, **data})


class AtStepOne:
    def __eq__(self, run) -> bool:
        return run["step"] == 1


def wanted(**more) -> Question:
    return Question(n=1, title="Is this step still wanted?", refs=["sequence:4"], **more)


def unless_bot(row: Todo) -> Given:
    return Given(todo("created"), rows=[on_creating("todo.created", unless={"assigned": "bot"}), row])


def todo(action: str, actor: str = USER) -> AnyEvent:
    return AnyEvent(n=5, type="todo", action=action, actor=actor)






CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
WROTE = AgentRow(n=1, title="claude-1", data={"wrote": True})
LINES = {line.name: line for line in SequencesDetails.lines}
RELEASE_KEY = "t|by hand"
DISPATCHING = Sequence(n=4, title="Planning a board", sections=[{"title": "Plan", "body": "Plan it."}], data={"dispatch": "Planner", "runs": {"t|board:2": {"step": 1, "at": 1.0}}})


class AtFollowed:
    def __eq__(self, runs) -> bool:
        return runs[RELEASE_KEY]["followed"] == 1


def sending(text: str) -> AgentMessageSending:
    return AgentMessageSending(text=text, turn="turn-1", session="claude-1")


def written(text: str) -> AgentTurnWritten:
    return AgentTurnWritten(agent=1, turn="turn-1", text=text)




HELD_TEXT = step_held_text(release(), RELEASE_KEY, {"step": 1})
HELD_TITLE = LINES[STEP_HELD].filled({"n": 4, "title": "Cutting a patch release", "step": 1, "about": ""})[0]
STALLED_TITLE = LINES[STEP_STALLED].filled({"n": 4, "title": "Cutting a patch release", "step": 1, "edits": 8, "about": ""})[0]
FILING = Sequence(n=4, title="Filing a to-do", sections=[{"title": "File it", "body": "Run journal todo create to file it."}], data={"runs": {RELEASE_KEY: {"step": 1, "at": 1.0}}})
STEP_VALUES = {"n": 4, "title": "Cutting a patch release", "step": 1, "count": 1, "name": "Tag it", "body": "Run journal version tag to cut the tag.",
               "then": " When it is done: journal sequence next 4.", "about": "", "chat_rule": ""}
DISPATCHED = DispatchDue(agent=1, session="claude-1", env="t", sequence=4, title="Planning a board", kind="Planner", about="board:2", board=2,
                         model=SERVED.given(Providers).model_for("claude", ""), why="a new request", request="")


class SequencesFeature(Feature):
    details = SequencesDetails
    nudges = (Nudge(UNFINISHED, behaviour=UNFINISHED, about=standing_steps, private=False, pace=step_pace,
                    guarantee="While a sequence stands at a step, the agent is told which step it is on until it moves on or gives the sequence up.",
                    expects=(Given(Ticked(), rows=(AGENT_ROW, handed(WHEN - 600)), earlier=(Reported("working", "PreToolUse"),)) >> Told("unfinished") & Nudged("unfinished"),
                             Given(Ticked(), rows=(AGENT_ROW, handed(WHEN)), earlier=(Reported("working", "PreToolUse"),)) >> Told("unfinished", times=0),
                             Given(Ticked(), rows=(AGENT_ROW, handed(WHEN - 90), Question(n=1, title="Which colour for the button?")), earlier=(Reported("working", "PreToolUse"),)) >> Told("unfinished"),
                             Given(Ticked(), rows=(AGENT_ROW, handed(WHEN - 300), wanted(updated=WHEN - 10)),
                                   earlier=(Reported("working", "PreToolUse"),)) >> Told("unfinished", times=0),
                             Given(Ticked(), rows=(AGENT_ROW, handed(WHEN - 300), wanted(completed=WHEN - 10)),
                                   earlier=(Reported("working", "PreToolUse"),)) >> Told("unfinished"))),)
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        STARTED_BY.add(None, Sequences)
        journal.events.listen(AnyEvent, SpotSequenceToStartOnMoment(), expects=[
            Given(todo("created"), rows=[on_creating("todo.created")]) >> Dispatches(SequenceStarts(sequence=4, about="todo:5")),
            Given(todo("created"), rows=[on_creating("plan.created")]) >> Dispatches(nothing),
            Given(AnyEvent(n=4, type="sequence", action="created", actor=USER), rows=[on_creating("sequence.created")]) >> Dispatches(nothing),
            Given(todo("created"), rows=[on_creating("todo.created", started_by="agent")]) >> Dispatches(nothing),
            Given(todo("created"), rows=[on_creating("todo.created", only_when_idle=True), release()]) >> Dispatches(nothing),
            Given(todo("renamed"), rows=[on_creating("todo.created")]) >> Dispatches(nothing),
            Given(todo("created"), rows=[on_creating("todo.created", started_by="user")]) >> Dispatches(SequenceStarts(sequence=4, about="todo:5")),
            Given(todo("created", AGENT), rows=[on_creating("todo.created", started_by="user")]) >> Dispatches(nothing),
            unless_bot(Todo(n=5, title="assigned to a bot", data={"assigned": "bot"})) >> Dispatches(nothing),
            unless_bot(Todo(n=5, title="free")) >> Dispatches(SequenceStarts(sequence=4, about="todo:5")),
            Given(todo("created"), rows=[on_creating("todo.created", only_when_idle=True)]) >> Dispatches(SequenceStarts(sequence=4, about="todo:5")),
        ])
        journal.events.listen(TriggerFired, SpotSequenceToStartOnTrigger(), expects=[
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "start", "words": ["triage"]}), on_creating("trigger:2")])
                >> Dispatches(SequenceStarts(sequence=4, about="message:7")),
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "nudge", "words": ["triage"]}), on_creating("trigger:2")])
                >> Dispatches(nothing),
            Given(TriggerFired(n=2, type="trigger", action="fired", actor=USER, about="message:7"), rows=[Trigger(n=2, title="Triage", data={"does": "start", "words": ["triage"]}), on_creating("trigger:3")])
                >> Dispatches(nothing),
        ])
        journal.events.handle(SequenceStarts, RunTheSequence(), expects=[
            Given(SequenceStarts(sequence=4, about="todo:5"), rows=[on_creating("todo.created")]) >> Updated(Sequence(n=4), runs={"t|todo:5": AtStepOne()}),
        ])
        journal.events.listen(AnyEvent, SpotRunOfADeletedRow(), expects=[
            Given(todo("deleted"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:5": {"step": 1, "at": 1.0}}})]) >> Dispatches(RunEnded(sequence=4, key="t|todo:5")),
            Given(todo("deleted"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:6": {"step": 1, "at": 1.0}}})]) >> Dispatches(nothing),
            Given(todo("completed"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:5": {"step": 1, "at": 1.0}}})]) >> Dispatches(nothing),
        ])
        journal.events.handle(RunEnded, DropTheRun(), expects=[
            Given(RunEnded(sequence=4, key="t|todo:5"), rows=[Sequence(n=4, title="Triage a to-do", data={"runs": {"t|todo:5": {"step": 1, "at": 1.0}}})]) >> Updated(Sequence(n=4), runs={}),
        ])
        journal.events.listen(SequenceMoved, SpotStepToHand(), expects=[
            Given(MOVED, rows=[release(), CLAUDE]) >> Dispatches(StepHeld(agent=1, sequence=4, title="Cutting a patch release", step=1, about=""))
                & Dispatches(StepToSay(agent=1, values=STEP_VALUES).once("1|4|t|by hand|1|1.0")),
            Given(MOVED, rows=[release(followed=1), CLAUDE]) >> Dispatches(StepTakenUp(agent=1)),
            Given(SequenceMoved(n=4, type="sequence", action="deleted", actor=USER), rows=[CLAUDE]) >> Dispatches(StepTakenUp(agent=1)),
            Given(MOVED, rows=[release()]) >> Dispatches(nothing),
            Given(MOVED, rows=[DISPATCHING, CLAUDE]) >> Dispatches(DISPATCHED.once("1|4|t|board:2|1.0|a new request")) & Dispatches(StepTakenUp(agent=1)),
        ])
        journal.events.handle(StepHeld, HoldTheAgentToTheStep(), expects=[
            Given(StepHeld(agent=1, sequence=4, title="Cutting a patch release", step=1, about=""), rows=[release(), CLAUDE]) >> Held(HELD_TITLE),
        ])
        journal.events.handle(StepToSay, TellTheStep(), expects=[
            Given(StepToSay(agent=1, values=STEP_VALUES), rows=[CLAUDE]) >> Nudged("step", **STEP_VALUES),
        ])
        journal.events.handle(StepTakenUp, LetTheAgentGo(), expects=[
            Given(StepTakenUp(agent=1), rows=[release(), CLAUDE], held=HELD_TEXT, held_under="step") >> Released(),
        ])
        journal.events.handle(DispatchDue, TellTheDispatch(), expects=[
            Given(DISPATCHED, rows=[CLAUDE]) >> Nudged("dispatch", kind="Planner", n=4, title="Planning a board", about="board:2", board=2, model=DISPATCHED.model, why="a new request", request=""),
        ])
        journal.events.listen(ClockTicked, SpotNoStepInHand(), expects=[
            Given(ClockTicked(agent=1), rows=[release(), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Dispatches(StepTakenUp(agent=1)),
        ])
        journal.events.listen(ToolFinished, SpotStepStandingThroughWrites(), expects=[
            Given(ToolFinished(agent=1), rows=[release(followed=1), WROTE]) >> Dispatches(StepEdited(agent=1, edits=1)),
            Given(ToolFinished(agent=1), rows=[release(followed=1), WROTE], files=answering(AFTER_SEVEN_EDITS), settings={"sequences.step_after": 8})
                >> Dispatches(StepEdited(agent=1, edits=8)) & Dispatches(StepStalled(agent=1, sequence=4, title="Cutting a patch release", step=1, edits=8, about="")),
            Given(ToolFinished(agent=1), rows=[release(followed=1), AGENT_ROW]) >> Dispatches(nothing),
            Given(ToolFinished(agent=1), rows=[release(), WROTE]) >> Dispatches(nothing),
            Given(ToolFinished(agent=1), rows=[WROTE]) >> Dispatches(nothing),
        ])
        journal.events.handle(StepEdited, CountTheEdit(), expects=[
            Given(StepEdited(agent=1, edits=3), rows=[AGENT_ROW]) >> Remembered("trigger-sequences", asdict(Mark(edits=3))),
        ])
        journal.events.handle(StepStalled, HoldTheStalledStep(), expects=[
            Given(StepStalled(agent=1, sequence=4, title="Cutting a patch release", step=1, edits=8, about=""), rows=[AGENT_ROW])
                >> Held(STALLED_TITLE),
        ])
        journal.events.listen(AnyEvent, SpotSequenceChange(), expects=[
            Given(AnyEvent(n=4, type="sequence", action="updated", actor=USER), rows=[AGENT_ROW]) >> Dispatches(StepCountRestarted(agent=1)),
            Given(AnyEvent(n=4, type="sequence", action="updated", actor=USER), rows=[AGENT_ROW, AgentRow(n=2, title="claude-2")])
                >> Dispatches(StepCountRestarted(agent=1)) & Dispatches(StepCountRestarted(agent=2)),
            Given(todo("created"), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(StepCountRestarted, CountTheEditsAfresh(), expects=[
            Given(StepCountRestarted(agent=1), rows=[AGENT_ROW], files=answering(AFTER_SEVEN_EDITS)) >> Remembered("trigger-sequences", asdict(Mark(edits=0))),
        ])
        journal.events.answer(AgentMessageSending, KeepOutOfTheChat(), expects=[
            Given(sending("Here is the update."), rows=[talking()]) >> Answered(Silenced()),
            Given(sending("Here is the update."), rows=[talking("")]) >> Answered(Allowed()),
            Given(sending("   "), rows=[talking()]) >> Answered(Allowed()),
            Given(sending("Here is the update.")) >> Answered(Allowed()),
        ])
        journal.events.listen(AgentTurnWritten, SpotTalkInChat(), expects=[
            Given(written("Here is the update."), rows=[talking(), AGENT_ROW]) >> Dispatches(TalkKeptOut(agent=1, title="Writing an update", place="the viewer").once("1|4|t|by hand|1.0")),
            Given(written("Here is the update."), rows=[talking(""), AGENT_ROW]) >> Dispatches(nothing),
            Given(written("   "), rows=[talking(), AGENT_ROW]) >> Dispatches(nothing),
            Given(written("Here is the update."), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(TalkKeptOut, NameTheChatRule(), expects=[
            Given(TalkKeptOut(agent=1, title="Writing an update", place="the viewer"), rows=[AGENT_ROW]) >> Nudged("in_chat", title="Writing an update", place="the viewer"),
        ])
        journal.events.listen(QuestionCompleted, SpotQuestionToDispatchAgain(), expects=[
            Given(QuestionCompleted(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main"), CLAUDE]) >> Dispatches(nothing),
            Given(QuestionCompleted(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main", refs=["board:2"]), CLAUDE]) >> Dispatches(nothing),
            Given(QuestionCompleted(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main", refs=["board:2"])]) >> Dispatches(nothing),
            Given(QuestionCompleted(n=1, type="question", action="completed", actor=USER), rows=[Question(n=1, title="Which branch?", outcome="main", refs=["board:2"]), DISPATCHING, CLAUDE])
                >> Dispatches(replace(DISPATCHED, why="question 1 answered: main").once("1|4|t|board:2|1.0|question 1 answered: main")),
        ])
        journal.events.answer(ToolCallAsked, HoldJournalWritesForTheStep(), expects=[
            Given(shell_asked('journal todo create "Later"'), rows=[release()]) >> Answered(Declined(HELD_TEXT)),
            Given(shell_asked('journal todo create "Later"'), rows=[release(followed=1)]) >> Answered(Allowed()),
            Given(shell_asked('journal todo create "Later"')) >> Answered(Allowed()),
            Given(shell_asked("journal version tag"), rows=[release()]) >> Answered(Allowed()),
            Given(shell_asked("journal todo show 3"), rows=[release()]) >> Answered(Allowed()),
            Given(shell_asked("journal sequence next 4"), rows=[release()]) >> Answered(Allowed()),
            Given(shell_asked("git status"), rows=[release()]) >> Answered(Allowed()),
        ])
        journal.events.listen(ToolCallAnswered, SpotStepFollowed(), expects=[
            Given(shell_answered('journal todo create "Later"'), rows=[FILING]) >> Dispatches(StepFollowed(sequence=4, about=None)),
            Given(shell_answered('journal todo create "Later"'), rows=[release()]) >> Dispatches(nothing),
            Given(shell_answered("journal version tag"), rows=[release()]) >> Dispatches(nothing),
            Given(shell_answered('journal todo create "Later"', why="held"), rows=[FILING]) >> Dispatches(nothing),
            Given(shell_answered('journal todo create "Later"'), rows=[Sequence(n=4, title="Filing a to-do", sections=FILING.sections, data={"runs": {RELEASE_KEY: {"step": 1, "at": 1.0, "followed": 1}}})]) >> Dispatches(nothing),
        ])
        journal.events.handle(StepFollowed, FollowTheStep(), expects=[
            Given(StepFollowed(sequence=4, about=None), rows=[FILING]) >> Updated(Sequence(n=4), runs=AtFollowed()),
        ])
