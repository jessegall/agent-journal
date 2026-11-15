from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerRunEndedMessage(MessageTemplate):
    """The nudge workers.run_ended."""

    key = "workers.run_ended"
    type = AgentMessageType.STEERING
    text = "Your run {output} ended: read it, then continue"
    plural_text = 'your runs {output} ended: read each, then go on'
    id_field = "output"
