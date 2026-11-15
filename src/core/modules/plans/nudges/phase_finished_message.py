from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PhaseFinishedMessage(MessageTemplate):
    """The nudge plans.phase_finished."""

    key = "plans.phase_finished"
    type = AgentMessageType.STEERING
    text = "plan {plan}: phase {phase} done"
    turn_limited = False
