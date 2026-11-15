from engine.command.context import Context
from engine.driver.nudger import MessageSender
from core.modules.drivers.commands.support.wake_agent_handler import WakeAgentHandler
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.drivers.nudges.agent_compacted_message import AgentCompactedMessage
from core.modules.drivers.support.waiting_line_typing import COMPACTED_WAKE_SOURCE, WaitingLineTyping


class WakeCompactedAgentHandler(WakeAgentHandler[WakeCompactedAgent]):
    """Saves the wake line for the agent and types it, with the lines that wait, then records on the
    compaction that its agent was woken."""

    command = WakeCompactedAgent
    wake_nudge = AgentCompactedMessage.declared()
    wake_source = COMPACTED_WAKE_SOURCE

    def __init__(self, nudger: MessageSender, typing: WaitingLineTyping, compactions: ContextCompactions) -> None:
        super().__init__(nudger, typing)
        self.compactions = compactions

    def handle(self, command: WakeCompactedAgent, context: Context) -> None:
        super().handle(command, context)
        self.compactions.record_wake(command.agent_id, context)
