from collections.abc import Collection

from core.modules.tasks.models.support.task_complexity import MOST_COMPLEXITY, TaskComplexity


def has_tags(task_tags: Collection[str], required: Collection[str]) -> bool:
    return set(required) <= set(task_tags)


def matches_complexity_range(complexity: TaskComplexity | None, minimum: TaskComplexity | None, maximum: TaskComplexity | None) -> bool:
    if minimum is None and maximum is None:
        return True
    if complexity is None:
        return False
    lower = minimum if minimum is not None else 1
    upper = maximum if maximum is not None else MOST_COMPLEXITY
    return lower <= complexity <= upper
