from engine.driver.foreign_answer import ForeignAnswer
from engine.driver.foreign_outcome import ForeignOutcome
from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from engine.provider.managed_hook import ManagedHook
from core.modules.drivers.conditions.foreign_hook import ForeignHook
from engine.provider.managed_hook_history import ManagedHookHistory
from core.modules.drivers.models.hook_call import HookCall

HISTORY_RUNS = 100


class ManagedHookHistoryQuery(Query[HookCall]):
    """Counts a project hook's last hundred recorded outcomes."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, HookCall)

    def read(self, hook: ManagedHook) -> ManagedHookHistory:
        calls = self.matching(ForeignHook(hook.id)).newest().limited(HISTORY_RUNS)
        records = [run for call in calls for run in reversed(call.foreign_runs) if run.id == hook.id][:HISTORY_RUNS]
        answers = [ForeignAnswer.read(run) for run in records]
        return ManagedHookHistory(runs=len(records), refused=sum(bool(answer.refusal) for answer in answers),
                                  rewritten=sum(bool(answer.updated_input) for answer in answers),
                                  timed_out=sum(record.timed_out for record in records),
                                  failed=sum(record.exit_code not in (0, 2) and not record.timed_out for record in records),
                                  last=records[0] if records else None,
                                  last_at=calls[0].creation_timestamp().text if records else None,
                                  last_outcome=ForeignOutcome.detected(records[0], answers[0]) if records else None)
