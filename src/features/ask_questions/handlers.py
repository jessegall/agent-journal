import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events.agents import AgentReported
from controllers.types import Agents, Questions
from engine.events.resources import AnyEvent, MessageCreated, QuestionAnswered, ResourceEvent
from features.nudges import Sent
from features.trigger import DAY
from providers.turns import last_text
from features.parts import AgentContext, Context, Handler
from features.ask_questions.choices import offers_choices
from resources.base import SYSTEM, USER, Ref

ASKING = "asking"
WAITED_ON = ("todo", "plan", "ticket")
GONE = {"completed": "closed", "deleted": "deleted"}


@dataclass(frozen=True)
class QuestionAsked(ResourceEvent):
    on: ClassVar[str] = "question.created"


class AskInsteadOfProse(Handler):
    behaviour = ASKING

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if offers_choices(last_text(context.agent.row)):
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
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        agents = Agents(context.record, actor=SYSTEM)
        row = agents.primary()
        if event.actor != USER or question.hidden or not row:
            return
        agents.card(row.n, label=f"You answered question {question.n}", icon="question",
                    color="var(--blocking)", side=USER, row=question.ref)


class DismissSettledQuestions(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type not in WAITED_ON or event.action not in GONE:
            return
        ref, questions = Ref(event.type, event.n), Questions(context.record, actor=SYSTEM)
        for question in [q for q in questions.rows.standing() if str(ref) in q.refs]:
            questions.dismiss(question.n, why=f"{ref.spoken}, which it was about, is {GONE[event.action]}")


def open_a_day(context, agent) -> list[Sent]:
    now = time.time()
    return [Sent(str(q.n), {"n": q.n, "title": q.title}) for q in Questions(context.record, actor=SYSTEM).rows.standing()
            if not q.hidden and now - q.created > DAY]
