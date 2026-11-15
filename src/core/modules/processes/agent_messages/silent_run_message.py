from engine.driver.seconds import Seconds
from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType

SILENT_RUN_INTERVAL = Seconds(600)


class SilentRunMessage(MessageTemplate):
    """The agent message processes.silent_run."""

    key = "processes.silent_run"
    type = AgentMessageType.NOTICE
    text = "Output {output} printed nothing for {seconds}s, so it is not streaming: {hint}"
    interval = Interval(SILENT_RUN_INTERVAL)
