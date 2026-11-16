from core.modules.plans.guards.checkpoint_run_guard import CheckpointRunGuard
from core.modules.plans.guards.one_task_phase_guard import OneTaskPhaseGuard
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.phase_test_guard import PhaseTestGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.guards.plan_wait_circle_guard import PlanWaitCircleGuard
from core.modules.plans.guards.task_dependency_circle_guard import TaskDependencyCircleGuard
from core.modules.plans.guards.task_wait_circle_guard import TaskWaitCircleGuard
from core.modules.plans.guards.unordered_tasks_guard import UnorderedTasksGuard

PLANS_GUARDS = [CheckpointRunGuard, PhasePositionGuard, PhaseTestGuard, PlanCloseGuard, OneTaskPhaseGuard, UnorderedTasksGuard, TaskWaitCircleGuard, TaskDependencyCircleGuard, PlanWaitCircleGuard]
