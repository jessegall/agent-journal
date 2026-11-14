from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window import Window
from suites.coding.support.skeletons import CODING_AGENT_SETTINGS_SKELETON
from suites.coding.windows.work_mode.keys.work_key import WorkKey
from suites.coding.windows.work_mode.keys.work_screen_key import WorkScreenKey
from suites.coding.windows.work_mode.keys.tests_screen_key import TestsScreenKey
from suites.coding.windows.work_mode.keys.advanced_screen_key import AdvancedScreenKey
from suites.coding.windows.work_mode.keys.helper_types_screen_key import HelperTypesScreenKey
from suites.coding.windows.work_mode.keys.find_key import FindKey
from suites.coding.windows.work_mode.keys.limits_key import LimitsKey
from suites.coding.windows.work_mode.keys.type_screen_key import TypeScreenKey
from suites.coding.windows.work_mode.keys.count_agents_key import CountAgentsKey
from suites.coding.windows.agent_settings.keys.assign_key import AssignKey


class AgentSettingsWindow(Window):
    """The agent settings: the work settings, the agents' limits, their settings screens and the assign rules."""

    name = "coding.agent-settings"
    title = "Agent settings"
    entry = "agent-settings.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_AGENT_SETTINGS_SKELETON
    icon = WindowIcon.WINDOW
    reads = ["work-settings show", "setting-screen show", "setting-screen index", "agent limits", "agent cards", "setting show", "assign-rule board", "assign-rule try", "assign-rule recent", "worker-route list"]
    runs = ["work-settings apply", "work-settings preset", "setting-screen apply", "setting set", "agent profile-limits", "agent retire", "assign-rule make", "assign-rule edit", "assign-rule move",
            "assign-rule enable", "assign-rule disable", "assign-rule delete", "assign-rule apply", "assign-rule reassign", "assign-rule give-back"]
    events = ["setting.*", "agent.*", "assign_rule.*", "assign_rule_condition.*", "worker_route.*"]
    keys = [WorkKey, WorkScreenKey, TestsScreenKey, AdvancedScreenKey, HelperTypesScreenKey, FindKey, LimitsKey, TypeScreenKey, CountAgentsKey, AssignKey]
