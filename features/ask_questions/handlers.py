from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentUpdated, ResourceEvent
from engine.transcript import last_text
from features.parts import Context, Handler
from features.ask_questions.choices import offers_choices

ASKING = "asking"


@dataclass(frozen=True)
class QuestionAsked(ResourceEvent):
    on: ClassVar[str] = "question.created"


class AskInsteadOfProse(Handler):
    behaviour = ASKING

    def handle(self, context: Context, event: AgentUpdated) -> None:
        if offers_choices(last_text(context.record, context.agent.row)):
            context.agent.say("prose")
            context.hold("prose held", ASKING)


class ReleaseOnceAsked(Handler):
    def handle(self, context: Context, event: QuestionAsked) -> None:
        context.release(ASKING)
