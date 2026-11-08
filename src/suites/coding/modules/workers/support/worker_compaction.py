from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from suites.coding.support.context_limit_check import ContextLimitCheck

CONTROL_KEY = "context"
CONTROL_VALUE = "compact"


class WorkerCompaction:
    """Compacts a worker past the context limit by resuming its session on the compaction line before its next
    job, because a worker's program runs in print mode and takes no typed lines. A line whose compaction
    left the token count as it was is not given again, so the worker starts over instead. A worker that
    reached the limit at worker next is told to stop before it works on its next task."""

    def __init__(self, limit_check: ContextLimitCheck, providers: Providers) -> None:
        self.limit_check, self.providers = limit_check, providers
        self.attempted_tokens: dict[str, int] = {}
        self.finished_task_ids: set[int] = set()
        self.running: set[int] = set()

    def stop_after_task(self, worker_id: int) -> None:
        if self.limit_check.tokens(worker_id) is not None:
            self.finished_task_ids.add(worker_id)

    def is_after_task(self, worker_id: int) -> bool:
        return worker_id in self.finished_task_ids

    def started(self, worker_id: int) -> None:
        self.running.add(worker_id)

    def is_running(self, worker_id: int) -> bool:
        return worker_id in self.running

    def finished(self, worker_id: int) -> bool:
        if worker_id not in self.running:
            return False
        self.running.remove(worker_id)
        return True

    def line(self, worker: Agent) -> str | None:
        self.finished_task_ids.discard(worker.id)
        tokens = self.limit_check.tokens(worker.id)
        provider = self.providers.provider(worker.program)
        if tokens is None or not provider.compacts_headless or self.attempted_tokens.get(worker.session) == tokens:
            return None
        self.attempted_tokens[worker.session] = tokens
        return next(choice.line for group in provider.controls if group.key == CONTROL_KEY for choice in group.choices if choice.value == CONTROL_VALUE)
