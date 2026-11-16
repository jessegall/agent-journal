from engine.helper_type.helper_type_book import HelperTypeBook
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import HOUR_SECONDS, Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_settings import HELPER_IDLE_HOURS

UNUSED_HELPERS_REASON = "the ended read-only helpers of every environment past their idle hours, a few a day"


class UnusedHelpers:
    """The read-only helpers of every environment that went unused past the idle hours a person set: not retired,
    their session ended before then, and no open job; at 0 hours there are none."""

    def __init__(self, queries: Queries, settings: SettingValues, types: HelperTypeBook, scopes: Scopes) -> None:
        self.queries, self.settings, self.types, self.scopes = queries, settings, types, scopes

    def idle_hours(self) -> int:
        return self.settings.number(HELPER_IDLE_HOURS)

    def past_idle_hours(self, timestamp: Timestamp) -> tuple[Agent, ...]:
        hours = self.idle_hours()
        if not hours:
            return ()
        cutoff = timestamp.plus_seconds(-hours * HOUR_SECONDS)
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            ended = tuple(self.queries.query(Agent).matching(Among("role", self.types.read_access_keys())).matching(IsNull("retired_at")).matching(
                Less("ended_at", cutoff.text)).every_row(UNUSED_HELPERS_REASON))
            if not ended:
                return ()
            working = set(self.queries.query(HelperJob).matching(IsNull("ended_at")).matching(Among("helper_id", [helper.id for helper in ended])).pluck("helper_id", int))
        return tuple(helper for helper in ended if helper.id not in working)
