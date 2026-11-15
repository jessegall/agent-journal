from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MonitorCommandNoteMessage(MessageTemplate):
    """The agent message processes.use_the_monitor_command."""

    key = "processes.use_the_monitor_command"
    type = AgentMessageType.STEERING
    text = "Do not poll output {output} again: wait for it; the wait ends when the run does"
    plural_text = 'do not ask again for outputs {output}: wait for each, which ends when its run does'
    id_field = "output"
