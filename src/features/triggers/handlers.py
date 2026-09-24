from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentMessageSent, ResourceEvent
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.recital import COMMANDS, mentioned, searched
from features.triggers.resource import DENY, FIRED, FROM_USER, INSTRUCT, MESSAGE, NUDGE, START, Trigger
from resources.base import SYSTEM, USER

WATCHING = "watching"
CHAT_DENIED = "caught a denied word in the agent's message"
DONE = {MESSAGE: "sent a message", NUDGE: "nudged the agent", INSTRUCT: "instructed the agent", DENY: "denied the call", START: "started its sequence"}


def firing(context, text_of, from_user: bool = False) -> list:
    return [row for row in context.journal.acting(SYSTEM).triggers._standing()
            if (from_user or row.words_in != FROM_USER) and mentioned(row.words, text_of(str(row.words_in or "both")))]


def fire(context, agent, row, done: str = "") -> None:
    context.journal.acting(SYSTEM).agents.card(agent.n, label=f"Trigger {row.title} {done or DONE[row.does]}", icon=Trigger.icon,
                                               tone="danger" if row.does == DENY else "note", title=row.text or row.brief, ref=row.ref)
    if row.does == MESSAGE:
        context.journal.acting(USER).messages.create(row.title, brief=row.brief or row.text)
    elif row.does in (NUDGE, INSTRUCT):
        context.feature.journal.whisper(context.record, agent, row.does, title=row.title, text=row.text or row.brief)
    context.record.emit("trigger", row.n, FIRED, SYSTEM)


class WatchWhatTheAgentDoes(ToolInterceptor):
    behaviour = WATCHING

    def intercept(self, context: AgentContext, call) -> str:
        for row in firing(context, lambda scope: searched(call, scope)):
            fire(context, context.agent.row, row)
            if row.does == DENY:
                return f"{row.title} - {row.text or row.brief or 'this call is denied by a trigger'}"
        return ""


class WatchWhatTheAgentWrites(Handler):
    behaviour = WATCHING

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        for row in firing(context, lambda scope: "" if scope == COMMANDS else event.text):
            fire(context, context.agent.row, row, CHAT_DENIED if row.does == DENY else "")
            if row.does == DENY:
                context.agent.whisper("denied", title=row.title, text=row.text or row.brief)


@dataclass(frozen=True)
class MessageArrived(ResourceEvent):
    on: ClassVar[str] = "message.created"


class WatchWhatTheUserWrites(Handler):
    behaviour = WATCHING

    def handle(self, context: Context, event: MessageArrived) -> None:
        if event.actor != USER:
            return
        agent = context.journal.acting(SYSTEM).agents.primary()
        message = context.journal.messages.load(event.n)
        text = f"{message.title} {message.brief}"
        for row in firing(context, lambda scope: "" if scope == COMMANDS else text, from_user=True):
            if agent and row.does != DENY:
                fire(context, agent, row)
