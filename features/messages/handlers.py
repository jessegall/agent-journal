from engine.events import AgentMessageSent
from features.parts import Context, Handler
from resources.base import AGENT, titled


class SaveAgentMessage(Handler):
    def handle(self, context: Context, event: AgentMessageSent) -> None:
        if context.agent and event.text.strip() and context.once("shown", event.text):
            context.journal.acting(AGENT).messages.create(titled(event.text), brief=event.text)
