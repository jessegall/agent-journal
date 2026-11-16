from core.modules.drivers.models.agent_line import AgentLine
from engine.command.context import Context
from engine.enums.line_delivery import LineDelivery
from engine.driver.agent_message import AgentMessage
from engine.driver.message_sender import MessageSender
from engine.repository.repository import Repository


class AgentLineSender(MessageSender):
    """Sends an agent message by saving an agent line: the one place that writes the row an agent's next hook
    gives or the server types."""

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def send_agent_message(self, agent_id: int, agent_message: AgentMessage, source: str, context: Context, wakes_agent: bool = False) -> AgentLine:
        declaration = agent_message.declaration
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=agent_message.text, source=source,
                                              wakes_agent=wakes_agent or agent_message.wakes_agent, repeats_without_hook=declaration is not None and declaration.repeats_without_hook,
                                              delivery=declaration.delivery if declaration is not None else LineDelivery.TERMINAL_TYPING, agent_message_json=agent_message.stored.json), context)

    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False,
                  delivery: LineDelivery = LineDelivery.TERMINAL_TYPING) -> AgentLine:
        return self.repository.save(AgentLine(session_agent_id=agent_id, creator_id=context.actor.id, text=text, source=source, wakes_agent=wakes_agent,
                                              repeats_without_hook=repeats_without_hook, delivery=delivery), context)
