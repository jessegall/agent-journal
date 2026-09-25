import re
import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentMessageSending, AgentReported, AnyEvent, ClockTicked, ResourceEvent
from engine.sessions import Sessions
from engine.transcript import IDLE
from features.journal import waiting
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.work_tracking.details import WorkDetails
from features.sequences.controller import BY_HAND
from features.triggers.controller import Triggers
from features.triggers.resource import FIRED, START
from controllers.types import CONTROLLERS
from resources.base import SECTION, SYSTEM
from resources.types import TYPES

STEP = "step"
STEP_HELD = "step held"
IN_CHAT = "in_chat"
UNFINISHED = "unfinished"
WAITING = "waiting"
MINUTE = 60
JOURNAL_CALL = re.compile(r"(?:^|[;&|(\n])\s*(journal\s[^;&|\n]*)")
FREE_WHILE_HELD = re.compile(r"journal\s+(?:--\S+\s+)*(?:sequence\s+(?:follow|next|abandon|show|all)|message\s)")


@dataclass(frozen=True)
class SequenceMoved(ResourceEvent):
    on: ClassVar[str] = "sequence"


@dataclass(frozen=True)
class TriggerFired(ResourceEvent):
    on: ClassVar[str] = f"trigger.{FIRED}"
    about: str = ""


def about_flag(key: str) -> str:
    about = key.split("|", 1)[1]
    return "" if about == BY_HAND else f" --about {about}"


def filled(context: Context, n: int, key: str, body: str) -> str:
    about = key.split("|", 1)[1]
    text = body.replace("<this sequence>", str(n))
    if about == BY_HAND:
        return text
    kind, _, number = about.partition(":")
    board = board_of(context, about)
    text = text.replace("<ref>", about).replace(f"<{kind} n>", number).replace("<ref n>", number).replace("<type>", kind)
    return text.replace("<board n>", str(board)) if board else text


def board_of(context: Context, about: str) -> int:
    kind, _, n = about.partition(":")
    if kind == "board":
        return int(n)
    if kind != "message" or not n.isdigit():
        return 0
    refs = context.journal.messages.load(int(n)).refs
    return next((int(ref.split(":")[1]) for ref in refs if ref.startswith("board:")), 0)


def matches(found, values: dict) -> bool:
    return all(found.data.get(key) == value for key, value in values.items())


class StartOnMoment(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type == "sequence" or event.type not in TYPES or event.action not in TYPES[event.type].moments:
            return
        start(context, f"{event.type}.{event.action}", event, f"{event.type}:{event.n}")


class StartOnTrigger(Handler):
    def handle(self, context: Context, event: TriggerFired) -> None:
        if Triggers(context.record, actor=SYSTEM).load(event.n).does == START:
            start(context, f"trigger:{event.n}", event, event.about or f"trigger:{event.n}")


def start(context: Context, moment: str, event: ResourceEvent, about: str) -> None:
    sequences = context.journal.sequences
    for row in sequences.summaries():
        if row["completed"] or row["deleted"] or row.get("starts_on") != moment:
            continue
        if row.get("started_by") and row["started_by"] != event.actor:
            continue
        if row.get("only_when_idle") and sequences._in_hand():
            continue
        unless = sequences.load(row["n"]).unless
        if unless and event.type in CONTROLLERS and matches(CONTROLLERS[event.type](context.record, actor=SYSTEM).load(event.n), unless):
            continue
        sequences.run(row["n"], about=about)


class EndWithItsRow(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.action != "deleted" or event.type == "sequence":
            return
        sequences = context.journal.sequences
        key = f"{context.record.env}|{event.type}:{event.n}"
        for row in sequences.summaries():
            if row["completed"] or row["deleted"]:
                continue
            sequence = sequences.load(row["n"])
            if key in sequence.runs:
                sequences.update(sequence.n, runs={k: v for k, v in sequence.runs.items() if k != key})


class RemindUnfinished(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        found = context.journal.sequences._in_hand() if context.agent.row.status == IDLE else None
        if not found or found[0].lasting:
            return
        sequence, key, run = found
        left = context.journal.sequences._left(sequence, run)
        context.once(UNFINISHED, f"{sequence.n}|{key}|{run['step']}|{int(time.time() // (pace(context) * MINUTE))}", lambda: context.agent.say(
            UNFINISHED, n=sequence.n, title=sequence.title, step=run["step"], count=len(context.journal.sequences._steps(sequence)),
            about=about_flag(key), left="; ".join(left)))


def working_agent(context: Context):
    holder = Sessions(context.record.root).holder(context.record.env)
    return (context.journal.agents._titled(holder) if holder else None) or context.journal.agents.primary()


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = working_agent(context)
        found = context.journal.sequences._in_hand() if agent else None
        if not found:
            if agent:
                context.speaking_to(agent).release(STEP)
            return
        sequence, key, run = found
        speaking = context.speaking_to(agent)
        if run.get("followed") == run["step"]:
            speaking.release(STEP)
            return
        speaking.hold(STEP_HELD, STEP, n=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key))
        steps = context.journal.sequences._steps(sequence)
        part = steps[run["step"] - 1]
        speaking.once(STEP, f"{sequence.n}|{key}|{run['step']}|{run.get('stepped', run['at'])}", lambda: speaking.agent.say(
            STEP, n=sequence.n, title=sequence.title, step=run["step"], count=len(steps), name=part[SECTION.title],
            body=filled(context, sequence.n, key, part[SECTION.body]), about=about_flag(key), chat_rule=chat_rule(sequence),
            then=then_next(sequence.n, key, part[SECTION.body])))


def then_next(n: int, key: str, body: str) -> str:
    return "" if "sequence next" in body else f" When it is done: journal sequence next {n}{about_flag(key)}."


def chat_rule(sequence) -> str:
    return f" Write nothing in the chat while this runs: the user is in {sequence.talks_in}." if sequence.talks_in else ""


class KeepOutOfTheChat(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        found = context.journal.sequences._in_hand()
        if not found or not found[0].talks_in or not event.text.strip():
            return
        event.stop()
        sequence, key, run = found
        if context.once(IN_CHAT, f"{sequence.n}|{key}|{run['at']}"):
            context.agent.whisper(IN_CHAT, title=sequence.title, place=sequence.talks_in)


def pace(context: AgentContext) -> int:
    if waiting(context.record, context.agent.row):
        return minutes(WorkDetails.values(context.record).ask_awaiting_every)
    return minutes(context.settings.nudge_every)


def minutes(value) -> int:
    return max(1, int(value)) if str(value).strip().isdigit() else 1


def asked_since(context: AgentContext, at: float, about: set) -> bool:
    return any(not row["completed"] and not row["deleted"] and row["updated"] >= at and about & set(row["refs"])
               for row in context.journal.questions.summaries())


class NudgeWaitingStep(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        found = context.journal.sequences._in_hand()
        if not found or found[0].lasting:
            return
        sequence, key, run = found
        handed = run.get("stepped", run["at"])
        waited = int((time.time() - handed) // (pace(context) * MINUTE))
        if waited < 1 or asked_since(context, handed, {sequence.ref, key.split("|", 1)[1]}):
            return
        steps = context.journal.sequences._steps(sequence)
        step = steps[run["step"] - 1]
        context.once(WAITING, f"{sequence.n}|{key}|{run['step']}|{handed}|{waited}", lambda: context.agent.say(
            WAITING, n=sequence.n, title=sequence.title, step=run["step"], count=len(steps), name=step[SECTION.title],
            body=filled(context, sequence.n, key, step[SECTION.body]), about=about_flag(key), then=then_next(sequence.n, key, step[SECTION.body])))


class HoldJournalWritesForTheStep(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        found = context.journal.sequences._in_hand()
        if not found or found[2].get("followed") == found[2]["step"]:
            return ""
        sequence, key, run = found
        held = [found for command in call.commands for found in JOURNAL_CALL.findall(command) if not FREE_WHILE_HELD.match(found)]
        return (f"sequence {sequence.n}, {sequence.title}, handed you step {run['step']}: take it up with journal sequence follow "
                f"{sequence.n}{about_flag(key)} first") if held else ""
