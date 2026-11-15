from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerHelpRequestMessage(MessageTemplate):
    """The nudge workers.help-request."""

    key = "workers.help-request"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} is stuck on {tasks}, wait:{wait}: send it a job'
    turn_limited = False
    wakes_agent = True
