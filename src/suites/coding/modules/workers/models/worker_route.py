from collections.abc import Collection
from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.positioned import Positioned
from engine.profile.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.support.task_match import has_tags, matches_complexity_range


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
        return has_tags(task_tags, self.tags)

    @property
    def needs_complexity(self) -> bool:
        return self.minimum_complexity is not None or self.maximum_complexity is not None

    def matches(self, task_tags: Collection[str], complexity: TaskComplexity | None) -> bool:
        return self.matches_tags(task_tags) and matches_complexity_range(complexity, self.minimum_complexity, self.maximum_complexity)

    @property
    def reason(self) -> str:
        tag_text = " ".join(self.tags)
        return f"route {self.id} ({tag_text})" if tag_text else f"route {self.id}"
