from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AliasPluginOffMessage(MessageTemplate):
    """The nudge aliases.plugin_off."""

    key = "aliases.plugin_off"
    type = AgentMessageType.REFUSAL
    text = "This line's alias belongs to plugin:{plugin}, which is switched off: run it another way or ask to switch it on"
