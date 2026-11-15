from engine.enums.line_delivery import LineDelivery
from abc import ABC, abstractmethod

from engine.command.context import Context
from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.model.model import Model


class MessageSender(ABC):
    """Gives an agent a line outside a hook's own answer and returns the saved row of that line. Declared
    nudges keep their templates; other text is read by its row number. The drivers module binds the class
    that writes."""

    def send(self, agent_id: int, declaration: MessageTemplate, source: str, context: Context, **values: object) -> Model:
        return self.send_agent_message(agent_id, declaration.agent_message(**values), source, context)

    @abstractmethod
    def send_agent_message(self, agent_id: int, agent_message: AgentMessage, source: str, context: Context, wakes_agent: bool = False) -> Model: ...

    @abstractmethod
    def send_text(self, agent_id: int, text: str, source: str, context: Context, wakes_agent: bool = False, repeats_without_hook: bool = False,
                  delivery: LineDelivery = LineDelivery.TERMINAL_TYPING) -> Model: ...
