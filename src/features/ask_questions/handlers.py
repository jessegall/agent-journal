from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, ResourceEvent
from engine.transcript import last_text
from features.parts import AgentContext, Context, Handler
from features.ask_questions.choices import offers_choices
from resources.base import USER

ASKING = "asking"
ANSWER_SHOWN = 80


@dataclass(frozen=True)
class QuestionAsked(ResourceEvent):
    on: ClassVar[str] = "question.created"


@dataclass(frozen=True)
class QuestionAnswered(ResourceEvent):
    on: ClassVar[str] = "question.completed"


class AskInsteadOfProse(Handler):
    behaviour = ASKING

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if offers_choices(last_text(context.record, context.agent.row)):
            context.agent.say("prose")
            context.hold("prose held", ASKING)


@dataclass(frozen=True)
class MessageArrived(ResourceEvent):
    on: ClassVar[str] = "message.created"


class ReleaseOnceAnswered(Handler):
    def handle(self, context: Context, event: MessageArrived) -> None:
        if event.actor == USER:
            context.release(ASKING)


class ReleaseOnceAsked(Handler):
    def handle(self, context: Context, event: QuestionAsked) -> None:
        context.release(ASKING)


class MarkTheAnswer(Handler):
    def handle(self, context: Context, event: QuestionAnswered) -> None:
        question = context.journal.of("question").load(event.n)
        agents = context.journal.of("agent")
        row = agents.primary()
        if event.actor != USER or question.hidden or not row:
            return
        agents.card(row.n, label=f"You answered question {question.n}", name=question.outcome[:ANSWER_SHOWN], icon="question",
                    color="var(--blocking)", side=USER, row=question.ref)
