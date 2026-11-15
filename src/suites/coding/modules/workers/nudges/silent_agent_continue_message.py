from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SilentAgentContinueMessage(MessageTemplate):
    """The nudge workers.continue_silent_agent."""

    key = "workers.continue_silent_agent"
    type = AgentMessageType.STEERING
    text = "Continue your unfinished work."
    turn_limited = False
    wakes_agent = True
    repeats_without_hook = True
