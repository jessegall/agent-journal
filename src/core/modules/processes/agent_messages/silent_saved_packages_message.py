from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.agent_messages.silent_run_message import SILENT_RUN_INTERVAL


class SilentSavedPackagesMessage(MessageTemplate):
    """The nudge processes.silent_saved_packages."""

    key = "processes.silent_saved_packages"
    type = AgentMessageType.NOTICE
    text = "Alias {name} printed nothing for {seconds}s: go test holds each package's output until it is done, so run one package at a time or with -p 1. This run stays silent; the next shows its steps"
    interval = Interval(SILENT_RUN_INTERVAL)
