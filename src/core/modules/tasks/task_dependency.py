from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class TaskDependency(Model):
    """One task waiting on another; a loop of tasks waiting on each other is refused."""

    model_name = "task_dependency"
    cli_noun = "task-dependency"

    task_id: int
    dependency_id: int
    creator_id: int
