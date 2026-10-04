from engine.events.agents import AgentReported
from engine.events.resources import MessageUpdated, ResourceCreated
from engine.transcript import IDLE
from features.messages.answering import answered, read_and_open, theirs
from features.messages.linking import filed
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, SECTION, USER

ANSWERS = {"comment": "answered", "reaction": "acknowledged"}


class CloseHandled(Handler):
    behaviour = "closing"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if context.agent.row.status != IDLE:
            return
        for message in read_and_open(context.journal):
            results = [*message.refs, *(s[SECTION.body] for s in message.sections)]
            if results and answered(context.journal, message) and not context.journal.messages.load(message.n).completed:
                context.journal.messages.complete(message.n, how=f"handled: {', '.join(dict.fromkeys(results))}")


class CloseSeenByUser(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: MessageUpdated) -> None:
        messages = context.journal.messages
        for n in event.numbers:
            message = messages.load(n)
            if not message.completed and not theirs(message) and USER in message.seen:
                messages.complete(message.n, how="read by the user")


class CloseAnswered(Handler):
    behaviour = "closing"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type not in ANSWERS or event.actor != AGENT:
            return
        messages = context.journal.messages
        for ref in context.journal.of(event.type).load(event.n).refs:
            kind, _, n = ref.partition(":")
            if kind != "message" or not n.isdigit():
                continue
            message = messages.load(n)
            if not message.completed and theirs(message) and answered(context.journal, message):
                filed(context, message)
                messages.complete(message.n, how=f"{ANSWERS[event.type]} by the agent")
