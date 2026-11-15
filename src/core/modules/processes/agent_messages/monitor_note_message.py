from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MonitorNoteMessage(MessageTemplate):
    """The agent message processes.use_a_monitor."""

    key = "processes.use_a_monitor"
    type = AgentMessageType.STEERING
    text = "Do not poll output {output} again: set a Monitor on its wait"
    plural_text = 'do not ask again for outputs {output}: set a Monitor on each wait'
    id_field = "output"
