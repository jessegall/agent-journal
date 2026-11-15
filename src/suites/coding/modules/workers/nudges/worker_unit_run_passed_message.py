from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerUnitRunPassedMessage(MessageTemplate):
    """The nudge workers.unit_run_passed."""

    key = "workers.unit_run_passed"
    type = AgentMessageType.STEERING
    text = 'phase:{phase} tests passed on your commit: {line}'
    turn_limited = False
    wakes_agent = True
    path_fields = ["line"]
