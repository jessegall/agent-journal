from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.tasks.conditions.dependency_chain import DependencyChain
from core.modules.tasks.task_dependency import TaskDependency
from core.modules.tasks.task_query import TaskQuery


class NoDependencyLoop(Guard):
    """Refuses a dependency that would make a task wait, through others, on itself."""

    name = "tasks.no-dependency-loop"
    event = "task_dependency.create"

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def check(self, change: Change[Model]) -> None:
        dependency = change.row
        if not isinstance(dependency, TaskDependency):
            return
        if self.tasks.matching(DependencyChain(dependency.dependency_id)).filter(id=dependency.task_id).exists():
            raise Refusal(f"task {dependency.dependency_id} already waits on task {dependency.task_id}, so this would be a loop",
                          f"journal task undepend {dependency.dependency_id} {dependency.task_id} first")
