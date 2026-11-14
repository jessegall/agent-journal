from engine.viewer.preset_set import PresetSet
from suites.coding.viewer.presets.home.home_default_preset import HomeDefaultPreset
from suites.coding.viewer.presets.home.developer_preset import DeveloperPreset
from suites.coding.viewer.presets.home.home_chat_preset import HomeChatPreset
from suites.coding.viewer.presets.home.home_terminal_preset import HomeTerminalPreset
from suites.coding.viewer.presets.home.review_preset import ReviewPreset
from suites.coding.viewer.presets.home.monitor_preset import MonitorPreset
from suites.coding.viewer.presets.home.inbox_preset import InboxPreset
from suites.coding.viewer.presets.home.agents_preset import AgentsPreset


class HomePresets(PresetSet):
    """The layouts a person may choose for the home page."""

    presets = [HomeDefaultPreset, DeveloperPreset, HomeChatPreset, HomeTerminalPreset, ReviewPreset, MonitorPreset, InboxPreset, AgentsPreset]
