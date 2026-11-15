from engine.agent_machine.agent_view import AgentView
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING

PROGRAM_MARK = "@"


class AnsweringSlices:
    """The slices of the new driver that answer an agent at a hook (doc 1310 section 13.2): the slices it was
    pinned with that are still active in its environment for its program. A session start pins it to every
    active slice; a slice switched off drops out at once, and nothing of it is deleted."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def active(self, agent: Agent) -> frozenset[str]:
        entries = (entry.partition(PROGRAM_MARK) for entry in self.settings.texts(ACTIVE_SLICES_SETTING))
        return frozenset(name for name, _, program in entries if not program or program == agent.program)

    @staticmethod
    def pinned(view: AgentView, event: HookEvent, active: frozenset[str]) -> frozenset[str]:
        if event.event is HookEventName.SESSION_START:
            return active
        return frozenset(view.pinned_slices)
