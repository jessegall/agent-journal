from engine.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_program_compaction.record_program_compaction import RecordProgramCompaction
from core.modules.drivers.support.context_compactions import ContextCompactions
from suites.coding.support.context_limit_check import ContextLimitCheck

CONTROL_KEY = "context"
CONTROL_VALUE = "compact"


class WorkerCompaction:
    """Compacts a worker past the context limit by resuming its session on the compaction line before its next
    job, because a worker's program runs in print mode and takes no typed lines. Each such run is a compaction
    row, so a restart of the journal loses nothing: a run is going while its row has no wake recorded, and a
    line whose compaction left the token count as it was is not given again, so the worker starts over instead.
    A worker that reached the limit at worker next is told to stop before it works on its next task; that is
    kept only until its next launch."""

    def __init__(self, limit_check: ContextLimitCheck, providers: Providers, compactions: ContextCompactions) -> None:
        self.limit_check, self.providers, self.compactions = limit_check, providers, compactions
        self.finished_task_ids: set[int] = set()

    def stop_after_task(self, worker_id: int) -> None:
        if self.limit_check.tokens(worker_id) is not None:
            self.finished_task_ids.add(worker_id)

    def is_after_task(self, worker_id: int) -> bool:
        return worker_id in self.finished_task_ids

    def is_running(self, worker_id: int) -> bool:
        compaction = self.compactions.program_compaction(worker_id)
        return compaction is not None and compaction.woken_at is None

    def start_record(self, worker: Agent) -> RecordProgramCompaction | None:
        self.finished_task_ids.discard(worker.id)
        tokens = self.limit_check.tokens(worker.id)
        provider = self.providers.provider(worker.program)
        if tokens is None or self.is_attempted(worker.id, tokens):
            return None
        if not provider.compacts_headless:
            return None
        line = next(choice.line for group in provider.controls if group.key == CONTROL_KEY for choice in group.choices if choice.value == CONTROL_VALUE)
        return RecordProgramCompaction(worker.id, tokens, line)

    def is_attempted(self, worker_id: int, tokens: int) -> bool:
        attempted = self.compactions.program_compaction(worker_id)
        return attempted is not None and attempted.request_tokens == tokens
