from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerRunUnstartedMessage(MessageTemplate):
    """The agent message workers.worker_run_unstarted."""

    key = "workers.worker_run_unstarted"
    type = AgentMessageType.STEERING
    text = "phase:{phase} tests could not start on your commit; nothing failed: continue, your next commit starts them"
    turn_limited = False
