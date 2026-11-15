from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.agent_messages.silent_run_message import SILENT_RUN_INTERVAL


class SilentSavedFailureMessage(MessageTemplate):
    """The nudge processes.silent_saved_failure."""

    key = "processes.silent_saved_failure"
    type = AgentMessageType.STEERING
    text = "Saved command {name} failed without printing anything: fix its line"
    interval = Interval(SILENT_RUN_INTERVAL)
