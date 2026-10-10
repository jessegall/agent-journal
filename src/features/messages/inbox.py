from engine.events.agents import AgentReported
from engine.events.resources import MessageCreated
from engine.transcript import IDLE
from features import trigger
from features.messages.answering import unanswered
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT
from controllers.types import Messages

INBOX_AFTER = 5


def counted(context: Context, behaviour: str) -> int:
    key, row = context.feature.keyed(behaviour), context.agent.row
    count = trigger.last(context.record, row.title, key).count + 1
    trigger.write(context.record, row, key, count=count)
    return count


def patient(context: Context, behaviour: str) -> int:
    return int(context.settings[f"{behaviour}.patience"])


def reset(context: AgentContext, behaviour: str) -> None:
    trigger.write(context.record, context.agent.row, context.feature.keyed(behaviour), count=0)


class ResetCountsOnArrival(Handler):
    def handle(self, context: Context, event: MessageCreated) -> None:
        every = context.feature.behaviours["unread"].trigger.every
        for row in context.feature.reached(context.record, context.feature.lines["inbox"].reach):
            trigger.write(context.record, row, context.feature.keyed("unread"), uses=int(row.uses) - every)
        for row in context.feature.reached(context.record, context.feature.lines["answer"].reach):
            trigger.write(context.record, row, context.feature.keyed("answering"), uses=int(row.uses), count=0)


class NameUnread(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        unread = context.journal.get(Messages).unread(AGENT)
        if not unread or len(unread) <= INBOX_AFTER and context.agent.row.status != IDLE:
            context.release("unread")
            reset(context, "unread")
            return
        if not context.due("unread"):
            return
        context.agent.whisper("inbox")
        if counted(context, "unread") > patient(context, "unread"):
            context.hold("inbox held", "unread")


def hold_unanswered(context: AgentContext, held: list) -> None:
    """After answering.hold tool uses with a message still unanswered, the agent's tool calls wait until it is handled."""
    key, row = context.feature.keyed("answer hold"), context.agent.row
    began = trigger.last(context.record, row.title, key).uses
    if not began:
        began = int(row.uses) or 1
        trigger.write(context.record, row, key, uses=began)
    if int(row.uses) - began >= int(context.settings["answering.hold"]):
        context.hold("answer held", "answering", messages=", ".join(f"message {m.n}" for m in held[-3:]))


class NameUnanswered(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        held = unanswered(context.journal)
        if not held:
            reset(context, "answering")
            trigger.write(context.record, context.agent.row, context.feature.keyed("answer hold"), uses=0)
            context.release("answering")
            return
        hold_unanswered(context, held)
        if (context.agent.row.status == IDLE or context.due("answering")) and counted(context, "answering") <= patient(context, "answering"):
            context.agent.whisper("answer", messages=", ".join(f"message {m.n}" for m in held[-3:]), numbers=[m.n for m in held[-3:]],
                                  rows=[m.ref for m in held[-3:]])
