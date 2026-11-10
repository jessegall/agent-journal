from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.tasks.conditions.dependency_chain import DependencyChain
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.queries.task_query import TaskQuery
from engine.change.created import Created
from engine.command.context import Context


class NoDependencyLoopGuard(Guard[Created[TaskDependency]]):
    """Refuses a dependency that would make a task wait, through others, on itself."""

    name = "tasks.no-dependency-loop"
    is_safety = True

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def check(self, event: Created[TaskDependency], context: Context) -> None:
        dependency = event.row
        if self.tasks.matching(DependencyChain(dependency.dependency_id)).filter(id=dependency.task_id).exists():
            raise Refusal(f"task {dependency.dependency_id} already waits on task {dependency.task_id}, so this would be a loop",
                          f"stop that wait first with journal task remove-dependency {dependency.dependency_id} --on {dependency.task_id}")
