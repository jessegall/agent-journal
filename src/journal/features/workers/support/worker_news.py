from dataclasses import dataclass

from journal.engine.support.settings import Settings
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions


@dataclass(frozen=True)
class WorkerNews:
    """The news of an orchestrator's workers since its last line of it: how many merges, send-backs and dispatches they had, counted only, and what waits on the orchestrator, a short phrase each; gathered only in orchestrator mode with the news seconds set."""

    merged: int = 0
    sent_back: int = 0
    dispatched: int = 0
    needs: tuple[str, ...] = ()

    @staticmethod
    def is_gathered(settings: Settings) -> bool:
        return settings.integer(WorkersOptions.DIGEST_SECONDS) > 0 and settings.value(WorkersOptions.MODE) == ORCHESTRATOR_MODE

    def has_news(self) -> bool:
        return bool(self.merged or self.sent_back or self.dispatched or self.needs)

    def counts(self) -> str:
        return f"{self.merged} merged, {self.sent_back} sent back, {self.dispatched} dispatched"

    def needs_line(self) -> str:
        return ", ".join(self.needs) or "nothing"
