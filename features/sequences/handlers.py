from dataclasses import dataclass
from typing import ClassVar

from engine.events import AnyEvent, ResourceEvent
from features.parts import Context, Handler
from features.sequences.controller import BY_HAND
from resources.base import SECTION

STEP = "step"
MOMENTS = ("created", "completed")


@dataclass(frozen=True)
class SequenceMoved(ResourceEvent):
    on: ClassVar[str] = "sequence"


class StartOnMoment(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type == "sequence" or event.action not in MOMENTS:
            return
        sequences = context.journal.sequences
        moment = f"{event.type}.{event.action}"
        for row in sequences.summaries():
            if not row["completed"] and not row["deleted"] and row.get("starts_on") == moment:
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


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = context.journal.agents.primary()
        if event.action != "updated" or not agent:
            return
        sequence = context.journal.sequences.load(event.n)
        speaking = context.speaking_to(agent)
        for key, step in sequence.runs.items():
            env, about = key.split("|", 1)
            if env != context.record.env or not speaking.once(STEP, f"{sequence.n}|{key}|{step}"):
                continue
            part = sequence.sections[step - 1]
            speaking.agent.say(STEP, n=sequence.n, title=sequence.title, step=step, count=len(sequence.sections),
                               name=part[SECTION.title], body=part[SECTION.body], about="" if about == BY_HAND else f" --about {about}")
