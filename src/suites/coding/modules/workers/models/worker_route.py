from collections.abc import Collection
from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.positioned import Positioned
from core.base.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import MOST_COMPLEXITY, TaskComplexity


@dataclass(frozen=True, kw_only=True)
class WorkerRoute(EnvironmentScoped, Positioned):
    """Matches a task's tags and score to a program, a model tier or both."""

    model_name = "worker_route"
    cli_name = "worker-route"

    creator_id: int
    position: int
    environment_id: int = 0
    program: str = ""
    tags: tuple[str, ...] = ()
    minimum_complexity: TaskComplexity | None = None
    maximum_complexity: TaskComplexity | None = None
    tier: ModelTier | None = None
    strict: bool = False

    def matches_tags(self, task_tags: Collection[str]) -> bool:
        return set(self.tags) <= set(task_tags)

    @property
    def needs_complexity(self) -> bool:
        return self.minimum_complexity is not None or self.maximum_complexity is not None

    def matches(self, task_tags: Collection[str], complexity: TaskComplexity | None) -> bool:
        if not self.matches_tags(task_tags):
            return False
        if not self.needs_complexity:
            return True
        if complexity is None:
            return False
        lower = self.minimum_complexity if self.minimum_complexity is not None else 1
        upper = self.maximum_complexity if self.maximum_complexity is not None else MOST_COMPLEXITY
        return lower <= complexity <= upper

    @property
    def reason(self) -> str:
        tag_text = " ".join(self.tags)
        return f"route {self.id} ({tag_text})" if tag_text else f"route {self.id}"
