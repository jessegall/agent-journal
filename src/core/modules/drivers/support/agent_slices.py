from engine.agent_machine.agent_view import AgentView
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING

PROGRAM_MARK = "@"


class AgentSlices:
    """The slices of the new driver that answer an agent at a hook (doc 1310 section 13.2): the slices it was
    pinned with that are still active in its environment for its program. A session start pins it to every
    active slice, as does the first hook of an agent pinned to none; a slice switched off drops out at once, and
    nothing of it is deleted."""

    def __init__(self, settings: SettingValues, queries: Queries) -> None:
        self.settings, self.queries = settings, queries

    def has_active_slice(self) -> bool:
        return bool(self.settings.texts(ACTIVE_SLICES_SETTING))

    def active(self, agent: Agent) -> frozenset[str]:
        entries = (entry.partition(PROGRAM_MARK) for entry in self.settings.texts(ACTIVE_SLICES_SETTING))
        return frozenset(name for name, _, program in entries if not program or program == agent.program)

    # a session start pins the agent to every active slice, and so does the first hook of an agent pinned to none,
    # whose session began before any slice was on or whose start came before its row: from the old walk alone to
    # the new driver once, never from one set of slices to another mid-session
    @staticmethod
    def pinned(view: AgentView, event: HookEvent, active: frozenset[str]) -> frozenset[str]:
        if event.event is HookEventName.SESSION_START or not view.pinned_slices:
            return active
        return frozenset(view.pinned_slices)

    # an old tick's entrance stands down for an agent once its slice answers that agent, as a hook's old rule does
    def tick_slices(self, agent: Agent) -> frozenset[str]:
        row = self.queries.query(AgentStack).filter(session_agent_id=agent.id).first()
        return frozenset(row.pinned_slices if row is not None else ()) & self.active(agent)
