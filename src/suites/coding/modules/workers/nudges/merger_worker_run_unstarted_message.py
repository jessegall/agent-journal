from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerWorkerRunUnstartedMessage(MessageTemplate):
    """The nudge workers.merger_worker_run_unstarted."""

    key = "workers.merger_worker_run_unstarted"
    type = AgentMessageType.STEERING
    text = "Checkpoint phase:{phase} tests could not start on a commit of worker:{worker}"
    turn_limited = False
