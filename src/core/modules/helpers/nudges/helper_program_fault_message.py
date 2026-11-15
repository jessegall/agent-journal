from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperProgramFaultMessage(MessageTemplate):
    """The nudge helpers.program_fault."""

    key = "helpers.program_fault"
    type = AgentMessageType.STEERING
    text = "agent:{agent} program exited with code {code}: check its output"
    turn_limited = False
