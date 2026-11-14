from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window import Window
from suites.coding.support.skeletons import CODING_WORK_MODE_SKELETON
from suites.coding.windows.work_mode.keys.work_key import WorkKey
from suites.coding.windows.work_mode.keys.work_screen_key import WorkScreenKey
from suites.coding.windows.work_mode.keys.tests_screen_key import TestsScreenKey
from suites.coding.windows.work_mode.keys.advanced_screen_key import AdvancedScreenKey
from suites.coding.windows.work_mode.keys.helper_types_screen_key import HelperTypesScreenKey
from suites.coding.windows.work_mode.keys.find_key import FindKey
from suites.coding.windows.work_mode.keys.auto_key import AutoKey
from suites.coding.windows.work_mode.keys.limits_key import LimitsKey
from suites.coding.windows.work_mode.keys.type_screen_key import TypeScreenKey
from suites.coding.windows.work_mode.keys.count_agents_key import CountAgentsKey


class WorkModeWindow(Window):
    """The work mode control in the header: the work settings, auto mode, the agents' limits and their settings screens."""

    name = "coding.work-mode"
    title = "Work mode"
    entry = "work-mode.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_WORK_MODE_SKELETON
    icon = WindowIcon.WINDOW
    place = WindowPlace.HEADER
    reads = ["work-settings show", "setting-screen show", "setting-screen index", "setting show", "agent limits", "agent cards"]
    runs = ["work-settings preset", "work-settings apply", "setting-screen apply", "setting set", "agent profile-limits", "agent retire"]
    events = ["setting.*", "agent.*"]
    keys = [WorkKey, WorkScreenKey, TestsScreenKey, AdvancedScreenKey, HelperTypesScreenKey, FindKey, AutoKey, LimitsKey, TypeScreenKey, CountAgentsKey]
