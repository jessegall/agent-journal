from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.nudges.silent_run_message import SILENT_RUN_INTERVAL


class SilentSavedRunMessage(MessageTemplate):
    """The nudge processes.silent_saved_run."""

    key = "processes.silent_saved_run"
    type = AgentMessageType.NOTICE
    text = "Alias {name} printed nothing for {seconds}s: make it print each step. This run stays silent; the next shows its steps"
    interval = Interval(SILENT_RUN_INTERVAL)
