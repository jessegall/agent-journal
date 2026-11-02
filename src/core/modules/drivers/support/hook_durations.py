from collections.abc import Sequence

from core.base.database.database import Database
from core.base.database.points import Points
from core.base.driver.hook_event import HookEvent
from core.base.performance.performance_tools import PerformanceTools
from core.base.timing import Timing
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_NUDGES_SETTING
from core.modules.drivers.support.hook_cost_tool import HookCostTool
from core.modules.settings.bindings.support.setting_values import SettingValues

TERMINAL_NUDGE_CHARACTERS = 300


class HookDurations:
    """What the developer settings show of a hook: in the terminal how long it took and what it cost, by the hook
    cost tool, and each line the agent was sent."""

    def __init__(self, timing: Timing, settings: SettingValues, database: Database, tools: PerformanceTools) -> None:
        self.timing, self.settings, self.database, self.tools = timing, settings, database, tools
        self.begun = Points()

    def begin(self) -> None:
        self.begun = self.database.tally.points()

    def measured(self, event: HookEvent, environment_id: int, nudges: Sequence[str]) -> str:
        shown: list[str] = []
        if self.timing.stamps and self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is True:
            cost_line = self.tools.run(HookCostTool, event, self.begun)
            shown.extend([cost_line] if isinstance(cost_line, str) else [])
        if self.settings.value(HOOK_NUDGES_SETTING, environment_id) is True:
            shown.extend(nudge[:TERMINAL_NUDGE_CHARACTERS] for nudge in nudges if nudge)
        return "\n".join(shown)
