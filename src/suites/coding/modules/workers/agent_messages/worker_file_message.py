from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerFileMessage(MessageTemplate):
    """The nudge workers.file_is_the_workers."""

    key = "workers.file_is_the_workers"
    type = AgentMessageType.REFUSAL
    text = "That file is in worker {worker}'s worktree: send the worker a job, or wait for its delivery"
    turn_limited = False
