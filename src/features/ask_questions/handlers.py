from dataclasses import dataclass
from typing import ClassVar

from engine.events.agents import AgentReported
from engine.events.resources import MessageCreated, QuestionAnswered, ResourceEvent
from providers.turns import last_text
from features.parts import AgentContext, Context, Handler
from features.ask_questions.choices import offers_choices
from resources.base import USER

ASKING = "asking"


@dataclass(frozen=True)
class QuestionAsked(ResourceEvent):
    on: ClassVar[str] = "question.created"


class AskInsteadOfProse(Handler):
    behaviour = ASKING

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if offers_choices(last_text(context.record, context.agent.row)):
            context.agent.say("prose")
            context.hold("prose held", ASKING)


class ReleaseOnceAnswered(Handler):
    def handle(self, context: Context, event: MessageCreated) -> None:
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
        agents.card(row.n, label=f"You answered question {question.n}", icon="question",
                    color="var(--blocking)", side=USER, row=question.ref)
