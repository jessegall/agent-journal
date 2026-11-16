from engine.request.request_values import RequestValues
from engine.agent_machine.states.line_history import LineHistory
from engine.driver.seconds import Seconds
from engine.enums.hook_answer import HookAnswer
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES
from core.modules.processes.support.output_check_schedule import MINUTE_SECONDS

RETRY_SECONDS = Seconds(600)
CACHE_KEEPALIVE_KEY = "workers.cache-keepalive"


class CacheKeepalive:
    """Whether an idle main agent is woken to keep its prompt cache: it stopped, allowed, and has lasted the cold
    session minutes since its last hook, and was not woken in the last ten minutes. At 0 minutes it is off."""

    def __init__(self, history: LineHistory, hook_calls: HookCallQuery, queries: Queries, settings: SettingValues, clock: Clock, request_values: RequestValues) -> None:
        self.history, self.hook_calls, self.queries, self.settings, self.clock, self.request_values = history, hook_calls, queries, settings, clock, request_values

    # read once a step, so the line and the wake agree
    def is_due(self, agent_id: int) -> bool:
        return self.request_values.read(f"workers.cache-keepalive:{agent_id}", lambda: 0, lambda: self.found(agent_id))

    def found(self, agent_id: int) -> bool:
        minutes = self.settings.number(COLD_SESSION_MINUTES)
        if not minutes:
            return False
        latest = self.hook_calls.latest_turn_call(agent_id)
        if latest is None or latest.hook != HookEventName.STOP or latest.answer != HookAnswer.ALLOWED:
            return False
        now = self.clock.timestamp()
        if not self.queries.query(AgentActivity).find(agent_id).is_inactive(now, minutes * MINUTE_SECONDS):
            return False
        last_wake_at = self.history.last_given(CACHE_KEEPALIVE_KEY, agent_id)
        return last_wake_at is None or last_wake_at.elapsed_seconds(now) >= RETRY_SECONDS.count
