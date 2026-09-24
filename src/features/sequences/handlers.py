import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, AnyEvent, ClockTicked, ResourceEvent
from engine.sessions import Sessions
from engine.transcript import IDLE
from features.parts import AgentContext, Context, Handler
from features.sequences.controller import BY_HAND
from features.triggers.resource import FIRED
from resources.base import SECTION
from resources.types import TYPES

STEP = "step"
UNFINISHED = "unfinished"
WAITING = "waiting"
NUDGE_EVERY = 120


@dataclass(frozen=True)
class SequenceMoved(ResourceEvent):
    on: ClassVar[str] = "sequence"


def about_flag(key: str) -> str:
    about = key.split("|", 1)[1]
    return "" if about == BY_HAND else f" --about {about}"


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
            sequences.run(row["n"], about=f"{event.type}:{event.n}")


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
            context.agent.say(UNFINISHED, n=sequence.n, title=sequence.title, step=run["step"], count=len(sequence.sections), about=about_flag(key))


def working_agent(context: Context):
    holder = Sessions(context.record.root).holder(context.record.env)
    return (context.journal.agents._titled(holder) if holder else None) or context.journal.agents.primary()


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = working_agent(context)
        found = context.journal.sequences._in_hand() if event.action == "updated" and agent else None
        if not found:
            return
        sequence, key, run = found
        speaking = context.speaking_to(agent)
        if speaking.once(STEP, f"{sequence.n}|{key}|{run['step']}|{run['at']}"):
            part = sequence.sections[run["step"] - 1]
            speaking.agent.say(STEP, n=sequence.n, title=sequence.title, step=run["step"], count=len(sequence.sections),
                               name=part[SECTION.title], body=part[SECTION.body], about=about_flag(key))


def asked_since(context: AgentContext, at: float) -> bool:
    return any(not row["completed"] and not row["deleted"] and row["updated"] >= at for row in context.journal.questions.summaries())


class NudgeWaitingStep(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        found = context.journal.sequences._in_hand()
        if not found:
            return
        sequence, key, run = found
        handed = run.get("stepped", run["at"])
        waited = int((time.time() - handed) // NUDGE_EVERY)
        if waited < 1 or asked_since(context, handed) or not context.once(WAITING, f"{sequence.n}|{key}|{run['step']}|{handed}|{waited}"):
            return
        step = sequence.sections[run["step"] - 1]
        context.agent.say(WAITING, n=sequence.n, title=sequence.title, step=run["step"], count=len(sequence.sections),
                          name=step[SECTION.title], body=step[SECTION.body], about=about_flag(key))
