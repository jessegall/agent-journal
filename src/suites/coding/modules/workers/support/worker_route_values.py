from typing import TypedDict

from engine.enums.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity


class WorkerRouteValues(TypedDict, total=False):
    """The route flags a person typed; a flag left out is not a key."""

    program: str
    tags: tuple[str, ...]
    minimum_complexity: TaskComplexity
    maximum_complexity: TaskComplexity
    tier: ModelTier
    strict: bool
