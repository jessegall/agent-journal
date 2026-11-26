from core.modules.tasks.guards.assigned_task_start_guard import AssignedTaskStartGuard
from core.modules.tasks.guards.dependencies_closed_guard import DependenciesClosedGuard
from core.modules.tasks.guards.task_edit_access_guard import TaskEditAccessGuard
from core.modules.tasks.guards.task_tag_access_guard import TaskTagAccessGuard
from core.modules.tasks.guards.user_wait_guard import UserWaitGuard
from core.modules.tasks.guards.visible_dependency_guard import VisibleDependencyGuard

TASKS_GUARDS = [TaskTagAccessGuard, TaskEditAccessGuard, VisibleDependencyGuard, DependenciesClosedGuard, UserWaitGuard, AssignedTaskStartGuard]
