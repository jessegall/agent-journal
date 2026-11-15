from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProgramSettingsBanMessage(MessageTemplate):
    """The agent message agents.program_settings."""

    key = "agents.program_settings"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "The journal rewrites Claude Code and Codex settings at every start: change hooks through the journal's managed hooks"
