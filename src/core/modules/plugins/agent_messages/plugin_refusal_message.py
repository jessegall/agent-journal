from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PluginRefusalMessage(MessageTemplate):
    """The agent message plugins.plugin_refusal."""

    key = "plugins.plugin_refusal"
    type = AgentMessageType.REFUSAL
    text = "plugin:{plugin} refused this"
