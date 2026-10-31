import json

from core.base.guard.guard_switches import GuardSwitches
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.settings.setting import Setting


class SettingGuardSwitches(GuardSwitches):
    """Reads whether a guard is on from the project-wide setting under the guard's full name: false switches it
    off, any other value or none leaves it on. The core never asks this of core.lifecycle."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def enabled(self, guard_name: str) -> bool:
        rows = self.queries.query(Setting).filter(key=guard_name).matching(IsNull("environment_id")).page(1, 1).rows
        return not rows or json.loads(rows[0].value) is not False
