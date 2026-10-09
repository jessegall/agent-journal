from engine.events.agents import AgentReported
from engine.events.resources import MessageUpdated, ResourceCreated
from engine.transcript import IDLE
from features.messages.answering import answered, answers, read_and_open, theirs
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, SECTION, USER
from controllers.types import CONTROLLERS, Messages

ANSWERS = {"comment": "answered", "reaction": "acknowledged"}


def close_if_processed(journal, message) -> None:
    """Closes a message the agent processed into rows once it counts as answered: a question stays open until a written reply."""
    if (message.refs or message.sections) and answered(journal, message):
        results = [*message.refs, *(s[SECTION.body] for s in message.sections)]
        journal.get(Messages)._closed_once(message.n, f"handled: {', '.join(dict.fromkeys(results))}")


class CloseHandled(Handler):
    behaviour = "closing"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if context.agent.row.status != IDLE:
            return
        for message in read_and_open(context.journal):
            close_if_processed(context.journal, message)


class CloseSeenByUser(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: MessageUpdated) -> None:
        messages = context.journal.get(Messages)
        for n in event.numbers:
            message = messages.load(n)
            if not theirs(message) and USER in message.seen:
                messages._closed_once(message.n, "read by the user")


class CloseProcessed(Handler):
    """A message the agent processed into a row is handled as much as one it replied to or reacted to."""
    behaviour = "closing"

    def handle(self, context: Context, event: MessageUpdated) -> None:
        messages = context.journal.get(Messages)
        for n in event.numbers:
            message = messages.load(n)
            if theirs(message) and AGENT in message.seen and not message.completed:
                close_if_processed(context.journal, message)


class CloseAnswered(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type not in ANSWERS or event.actor != AGENT:
            return
        messages = context.journal.get(Messages)
        for ref in context.journal.get(CONTROLLERS[event.type]).load(event.n).refs:
            kind, _, n = ref.partition(":")
            if kind != "message" or not n.isdigit():
                continue
            message = messages.load(n)
            if theirs(message) and answers(event.type, message):
                messages._closed_once(message.n, f"{ANSWERS[event.type]} by the agent")
