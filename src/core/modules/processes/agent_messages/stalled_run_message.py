from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.agent_messages.silent_run_message import SILENT_RUN_INTERVAL


class StalledRunMessage(MessageTemplate):
    """The agent message processes.stalled_run."""

    key = "processes.stalled_run"
    type = AgentMessageType.NOTICE
    text = "Output {output} has written nothing for {seconds}s and is still running: {hint}"
    interval = Interval(SILENT_RUN_INTERVAL)
