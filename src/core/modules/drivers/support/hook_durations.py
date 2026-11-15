from collections.abc import Sequence

from engine.database.points import Points
from engine.driver.hook_event import HookEvent
from engine.module.performance_tools import PerformanceTools
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_AGENT_MESSAGES_SETTING
from core.modules.drivers.support.hook_cost_tool import HookCostTool
from engine.setting.setting_values import SettingValues

TERMINAL_AGENT_MESSAGE_CHARACTERS = 300


class HookDurations:
    """Shows a hook's database costs and the optional lines sent to its agent."""

    def __init__(self, settings: SettingValues, tools: PerformanceTools) -> None:
        self.settings, self.tools = settings, tools
        self.start_points: Points | None = None

    def begin(self) -> None:
        self.start_points = self.tools.begin()

    def measured(self, event: HookEvent, agent_messages: Sequence[str]) -> str:
        shown: list[str] = []
        cost = self.tools.cost(self.start_points)
        if cost is not None and self.settings.value(HOOK_DURATIONS_SETTING) is True:
            cost_line = self.tools.run(HookCostTool, event, cost)
            shown.extend([cost_line] if isinstance(cost_line, str) else [])
        if self.settings.value(HOOK_AGENT_MESSAGES_SETTING) is True:
            shown.extend(agent_message[:TERMINAL_AGENT_MESSAGE_CHARACTERS] for agent_message in agent_messages if agent_message)
        return "\n".join(shown)
