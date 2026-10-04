from controllers.messages import only_emoji
from engine.events.engine import AgentMessageSent
from features.parts import AgentContext, Handler
from resources.base import AGENT, titled


class SaveAgentMessage(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if not event.text.strip() or not context.once("shown", event.turn):
            return
        if only_emoji(event.text):
            context.agent.whisper("reaction", face=event.text.strip())
            return
        context.journal.acting(AGENT).messages.create(titled(event.text), brief=event.text, idempotency=event.turn)
