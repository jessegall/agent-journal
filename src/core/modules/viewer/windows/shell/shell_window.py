from engine.viewer.window import Window
from core.modules.viewer.support.shell_lines import SHELL_READS
from core.modules.viewer.support.shell_lines import SHELL_RUNS
from core.modules.viewer.support.skeletons import VIEWER_SHELL_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.viewer.windows.shell.keys.environments_key import EnvironmentsKey
from core.modules.viewer.windows.shell.keys.active_environments_key import ActiveEnvironmentsKey
from core.modules.viewer.windows.shell.keys.usage_key import UsageKey
from core.modules.viewer.windows.shell.keys.fitness_key import FitnessKey
from core.modules.viewer.windows.shell.keys.controls_key import ControlsKey
from core.modules.viewer.windows.shell.keys.programs_key import ProgramsKey
from core.modules.viewer.windows.shell.keys.skills_key import SkillsKey
from core.modules.viewer.windows.shell.keys.phones_key import PhonesKey
from core.modules.viewer.windows.shell.keys.bars_key import BarsKey
from core.modules.viewer.windows.shell.keys.activity_key import ActivityKey
from core.modules.viewer.windows.shell.keys.update_key import UpdateKey
from core.modules.viewer.windows.shell.keys.pins_key import PinsKey
from core.modules.viewer.windows.shell.keys.suite_presets_key import SuitePresetsKey
from core.modules.viewer.windows.shell.keys.person_presets_key import PersonPresetsKey


class ShellWindow(Window):
    """The Viewer window."""

    name = "viewer.shell"
    title = "Viewer"
    entry = "index.html"
    loading = WindowLoading.COMPONENT
    skeleton = VIEWER_SHELL_SKELETON
    icon = WindowIcon.WINDOW
    reads = SHELL_READS
    runs = SHELL_RUNS
    events = ["process.*", "output.*", "setting.*", "agent.*", "phone.*", "task.*", "question.*", "scheduled_job.*"]
    keys = [EnvironmentsKey, ActiveEnvironmentsKey, UsageKey, FitnessKey, ControlsKey, ProgramsKey, SkillsKey, PhonesKey, BarsKey, ActivityKey, UpdateKey, PinsKey, SuitePresetsKey, PersonPresetsKey]
