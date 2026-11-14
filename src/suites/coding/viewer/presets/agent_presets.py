from engine.viewer.preset_set import PresetSet
from suites.coding.viewer.presets.agent.agent_default_preset import AgentDefaultPreset
from suites.coding.viewer.presets.agent.agent_chat_preset import AgentChatPreset
from suites.coding.viewer.presets.agent.agent_terminal_preset import AgentTerminalPreset
from suites.coding.viewer.presets.agent.file_edits_preset import FileEditsPreset


class AgentPresets(PresetSet):
    """The layouts a person may choose for an agent's page."""

    presets = [AgentDefaultPreset, AgentChatPreset, AgentTerminalPreset, FileEditsPreset]
