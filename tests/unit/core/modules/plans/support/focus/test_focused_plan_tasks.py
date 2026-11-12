from contextlib import contextmanager
from types import SimpleNamespace

from core.modules.plans.support.focus.focused_plan_tasks import FocusedPlanTasks
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.unblockers.unblocker import Unblocker
from core.modules.plans.support.unblockers.unblockers import Unblockers
from core.modules.assignments.queries.conditions.unassigned import Unassigned
from engine.scope.actor_scope import ActorScope

AGENT = SimpleNamespace(id=4, environment_id=2)
TASKS = {task_id: SimpleNamespace(id=task_id, priority=100, assignee_id=None) for task_id in (1, 2, 9)}
TASKS[20] = SimpleNamespace(id=20, priority=100, assignee_id=4)
TASKS[21] = SimpleNamespace(id=21, priority=100, assignee_id=None)
TASKS[22] = SimpleNamespace(id=22, priority=200, assignee_id=None)


class OpenedScopes:
    def __init__(self):
        self.openings = []

    @contextmanager
    def opened(self, actor_id, environment_id=None, disabled=()):
        self.openings.append((actor_id, environment_id, tuple(disabled)))
        yield


class TaskRows:
    def __init__(self, tasks=None):
        self.tasks = tuple(TASKS.values()) if tasks is None else tasks

    def find(self, task_id):
        return TASKS[task_id]

    def matching(self, condition):
        if isinstance(condition, Unassigned):
            return TaskRows([task for task in self.tasks if task.assignee_id is None])
        return TaskRows([task for task in self.tasks if task.id in condition.values])

    def all_rows(self):
        return list(self.tasks)


def picker(focus_work, scopes=None, remaining=()):
    focus = SimpleNamespace(overview=lambda agent: SimpleNamespace(focus_work=focus_work, remaining=remaining))
    return FocusedPlanTasks(focus, TaskRows(), scopes or OpenedScopes())


def work():
    places = tuple(SimpleNamespace(task_id=task_id, position=position, priority=100) for task_id, position in ((1, 1), (2, 2)))
    return PlanWork(SimpleNamespace(id=1), places, Unblockers(tuple([Unblocker(9, 2, 100)])))


def plan_with_ready(*task_ids):
    return PlanWork(SimpleNamespace(id=2), tuple(SimpleNamespace(task_id=task_id, position=1, priority=100) for task_id in task_ids), Unblockers())


def test_with_nothing_in_the_focus_the_oldest_plan_with_a_task_reserved_for_nobody_gives_its_most_urgent_one():
    remaining = (plan_with_ready(20), plan_with_ready(21, 22), plan_with_ready(1))
    assert picker(None, remaining=remaining).first_started(AGENT).id == 22
    assert picker(None, remaining=remaining).first_started(AGENT, excluded_id=22).id == 21
    assert picker(work(), remaining=remaining).first_started(AGENT).id == 9
    assert picker(None, remaining=tuple([plan_with_ready(20)])).first_started(AGENT) is None


def test_an_agent_with_no_focus_is_given_nothing():
    assert picker(None).first(AGENT) is None


def test_the_task_the_most_plan_tasks_wait_on_is_picked_and_a_task_just_released_is_passed_over():
    assert picker(work()).first(AGENT).id == 9
    assert picker(work()).first(AGENT, excluded_id=9).id == 1


def test_a_focus_with_nothing_to_take_gives_nothing():
    assert picker(PlanWork(SimpleNamespace(id=1), (), Unblockers())).first(AGENT) is None


def test_the_rows_are_read_in_the_environment_of_the_agent_with_the_actor_scope_off():
    scopes = OpenedScopes()
    picker(work(), scopes).first(AGENT)
    assert scopes.openings == [(4, 2, tuple([ActorScope]))]
