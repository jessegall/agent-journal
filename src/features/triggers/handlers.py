from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.recital import mentioned, searched
from features.triggers.resource import DENY, INSTRUCT, MESSAGE, NUDGE
from resources.base import SYSTEM, USER

WATCHING = "watching"
DONE = {MESSAGE: "sent a message", NUDGE: "nudged the agent", INSTRUCT: "instructed the agent", DENY: "denied the call"}


def firing(context, text_of) -> list:
    return [row for row in context.journal.acting(SYSTEM).triggers._standing()
            if mentioned(row.words, text_of(str(row.words_in or "both")))]


def fire(context, agent, row) -> None:
    context.journal.acting(SYSTEM).agents.card(agent.n, label=f"Trigger {row.title} {DONE[row.does]}", icon="flag",
                                               tone="danger" if row.does == DENY else "note", title=row.text or row.brief)
    if row.does == MESSAGE:
        context.journal.acting(USER).messages.create(row.title, brief=row.brief or row.text)
    elif row.does in (NUDGE, INSTRUCT):
        context.feature.journal.whisper(context.record, agent, row.does, title=row.title, text=row.text or row.brief)


class WatchWhatTheAgentDoes(ToolInterceptor):
    behaviour = WATCHING

    def intercept(self, context: AgentContext, call) -> str:
        for row in firing(context, lambda scope: searched(call, scope)):
            fire(context, context.agent.row, row)
            if row.does == DENY:
                return f"{row.title} - {row.text or row.brief or 'this call is denied by a trigger'}"
        return ""


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
        for row in firing(context, lambda scope: "" if scope == "commands" else text):
            if agent and row.does != DENY:
                fire(context, agent, row)
