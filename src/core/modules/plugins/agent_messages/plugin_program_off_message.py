from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PluginProgramOffMessage(MessageTemplate):
    """The agent message plugins.program_off."""

    key = "plugins.program_off"
    type = AgentMessageType.REFUSAL
    text = "This program belongs to plugin {plugin}, which is switched off or not installed"
    id_field = "plugin"
