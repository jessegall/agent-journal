from dataclasses import dataclass

from core.modules.assign_rules.models.enums.creator_type import CreatorType
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.support.task_priority import TaskPriority


@dataclass(frozen=True, kw_only=True)
class TaskFacts:
    """What a rule's conditions can read about one task."""

    title: str
    brief: str
    complexity: TaskComplexity | None
    priority: TaskPriority
    tags: tuple[str, ...]
    creator_type: CreatorType
    creator_id: int
    plan_id: int | None
