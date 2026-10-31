from datetime import timedelta

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.less import Less
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.prune_hook_calls import PruneHookCalls
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.drivers.support.driver_settings import DAYS_SETTING



class PruneHookCallsHandler(Handler[PruneHookCalls, int]):
    """Deletes the hook calls older than the kept days and, first, the lines they gave; the rule history, which the
    rules and reminders read, is never pruned."""

    command = PruneHookCalls

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: PruneHookCalls, context: Context) -> int:
        days = self.settings.number(DAYS_SETTING, None)
        cutoff = Timestamp(context.timestamp.value - timedelta(days=days))
        calls = tuple(self.queries.query(HookCall).matching(Less("created_at", cutoff.text)).all_rows())
        for call in calls:
            for line in tuple(self.queries.query(AgentLine).filter(hook_call_id=call.id).all_rows()):
                self.repository.delete(line, context)
            self.repository.delete(call, context)
        return len(calls)
