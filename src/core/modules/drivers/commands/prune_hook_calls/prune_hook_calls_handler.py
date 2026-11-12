from datetime import timedelta

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls
from engine.setting.setting_values import SettingValues
from core.modules.drivers.support.driver_settings import DAYS_SETTING

BATCH_ROWS = 500
MOST_BATCHES = 20


class PruneHookCallsHandler(Handler[PruneHookCalls, int]):
    """Deletes the hook calls older than the kept days and, first, the lines they gave; the rule history,
    which the rules and reminders read, is never pruned."""

    command = PruneHookCalls

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: PruneHookCalls, context: Context) -> int:
        days = self.settings.project.number(DAYS_SETTING)
        cutoff = Timestamp(context.timestamp.value - timedelta(days=days))
        pruned = 0
        for _ in range(MOST_BATCHES):
            calls = self.queries.query(HookCall).matching(Less("created_at", cutoff.text)).oldest().limit(BATCH_ROWS, "one batch of old hook calls to delete").get()
            if not calls:
                break
            lines = self.queries.query(AgentLine).matching(Among("hook_call_id", [call.id for call in calls])).every_row("the lines of the hook calls deleted with them")
            self.repository.delete_many_stored(tuple(lines), context)
            self.repository.delete_many_stored(calls, context)
            pruned += len(calls)
        return pruned
