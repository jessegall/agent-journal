from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnstartedJobMessage(MessageTemplate):
    """The agent message workers.job_not_started."""

    key = "workers.job_not_started"
    type = AgentMessageType.STEERING
    text = "{name}:{agent} has had work waiting for {minutes} min and has not started: {action}"
    turn_limited = False
    wakes_agent = True
