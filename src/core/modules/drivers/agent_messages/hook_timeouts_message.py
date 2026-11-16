from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HookTimeoutsMessage(MessageTemplate):
    """The agent message drivers.hooks_timed_out."""

    key = "drivers.hooks_timed_out"
    type = AgentMessageType.STEERING
    text = "agent {agent} hit {count} hook timeouts in 10 min: its chat mark names the slowest rule"
    turn_limited = False
    wakes_agent = True
