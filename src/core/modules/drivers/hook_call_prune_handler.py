from datetime import timedelta

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.less import Less
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.drivers.agent_line import AgentLine
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.hook_call_prune import HookCallPrune
from core.modules.settings.setting_values import SettingValues

DAYS_SETTING = "drivers.hook-call-days"
DEFAULT_DAYS = 30


class HookCallPruneHandler(Handler[HookCallPrune, int]):
    """Deletes the hook calls older than the kept days and, first, the lines they gave; the rule history, which the
    rules and reminders read, is never pruned."""

    command = HookCallPrune

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: HookCallPrune, context: Context) -> int:
        days = self.settings.project_value(DAYS_SETTING, DEFAULT_DAYS)
        cutoff = Timestamp(context.timestamp.value - timedelta(days=days if isinstance(days, int) else DEFAULT_DAYS))
        calls = tuple(self.queries.query(HookCall).matching(Less("created_at", cutoff.text)).all_rows())
        for call in calls:
            for line in tuple(self.queries.query(AgentLine).filter(hook_call_id=call.id).all_rows()):
                self.repository.delete(line, context)
            self.repository.delete(call, context)
        return len(calls)
