import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentMessageSending, AgentReported, AnyEvent, ClockTicked, ResourceEvent
from engine.sessions import Sessions
from engine.transcript import IDLE
from features.parts import AgentContext, Context, Handler
from features.sequences.controller import BY_HAND
from features.triggers.resource import FIRED
from controllers.types import CONTROLLERS
from resources.base import SECTION, SYSTEM
from resources.types import TYPES

STEP = "step"
STEP_HELD = "step held"
IN_CHAT = "in_chat"
UNFINISHED = "unfinished"
WAITING = "waiting"
NUDGE_EVERY = 120


@dataclass(frozen=True)
class SequenceMoved(ResourceEvent):
    on: ClassVar[str] = "sequence"


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
        if event.type == "sequence" or event.type not in TYPES:
            return
        if event.action not in TYPES[event.type].moments and event.action != FIRED:
            return
        sequences = context.journal.sequences
        moment = f"{event.type}:{event.n}" if event.action == FIRED else f"{event.type}.{event.action}"
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
            about = f"{event.type}:{event.n}"
            if not sequences._running(sequences.load(row["n"]), about):
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
        if not found:
            return
        sequence, key, run = found
        if context.once(UNFINISHED, f"{sequence.n}|{key}|{run['step']}|{run['at']}"):
            context.agent.say(UNFINISHED, n=sequence.n, title=sequence.title, step=run["step"], count=len(context.journal.sequences._steps(sequence)), about=about_flag(key))


def working_agent(context: Context):
    holder = Sessions(context.record.root).holder(context.record.env)
    return (context.journal.agents._titled(holder) if holder else None) or context.journal.agents.primary()


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = working_agent(context)
        found = context.journal.sequences._in_hand() if event.action == "updated" and agent else None
        if not found:
            if agent and event.action == "updated":
                context.speaking_to(agent).release(STEP)
            return
        sequence, key, run = found
        speaking = context.speaking_to(agent)
        if run.get("followed") == run["step"]:
            speaking.release(STEP)
            return
        speaking.hold(STEP_HELD, STEP, n=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key))
        if speaking.once(STEP, f"{sequence.n}|{key}|{run['step']}|{run.get('stepped', run['at'])}"):
            steps = context.journal.sequences._steps(sequence)
            part = steps[run["step"] - 1]
            speaking.agent.say(STEP, n=sequence.n, title=sequence.title, step=run["step"], count=len(steps),
                               name=part[SECTION.title], body=filled(context, sequence.n, key, part[SECTION.body]), about=about_flag(key),
                               chat_rule=chat_rule(sequence))


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


def asked_since(context: AgentContext, at: float) -> bool:
    return any(not row["completed"] and not row["deleted"] and row["updated"] >= at for row in context.journal.questions.summaries())


class NudgeWaitingStep(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        found = context.journal.sequences._in_hand()
        if not found or found[0].lasting:
            return
        sequence, key, run = found
        handed = run.get("stepped", run["at"])
        waited = int((time.time() - handed) // NUDGE_EVERY)
        if waited < 1 or asked_since(context, handed) or not context.once(WAITING, f"{sequence.n}|{key}|{run['step']}|{handed}|{waited}"):
            return
        steps = context.journal.sequences._steps(sequence)
        step = steps[run["step"] - 1]
        context.agent.say(WAITING, n=sequence.n, title=sequence.title, step=run["step"], count=len(steps),
                          name=step[SECTION.title], body=filled(context, sequence.n, key, step[SECTION.body]), about=about_flag(key))
