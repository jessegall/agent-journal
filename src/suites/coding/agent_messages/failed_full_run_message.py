from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class FailedFullRunMessage(MessageTemplate):
    """The nudge processes.failed_full_run."""

    key = "processes.failed_full_run"
    type = AgentMessageType.REFUSAL
    text = "Your last full test run failed: rerun the failed tests by name first"
    turn_limited = False
