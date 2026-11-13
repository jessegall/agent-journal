from types import SimpleNamespace

import pytest

from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.rules.plan_focus_rule import PlanFocusRule
from core.modules.plans.support.unblockers.unblocker import Unblocker
from core.modules.plans.support.unblockers.unblockers import Unblockers

AGENT_ID = 4
PLACES = {11: 1, 12: 2, 13: 2}


class PlaceRows:
    def __init__(self, task_ids=()):
        self.task_ids = task_ids

    def matching(self, condition):
        return PlaceRows(condition.values) if condition.column == "task_id" else self

    def find(self, agent_id):
        return SimpleNamespace(id=agent_id)

    def get(self):
        return [SimpleNamespace(task_id=task_id, plan_id=PLACES[task_id]) for task_id in self.task_ids if task_id in PLACES]


def hook(line_numbers=()):
    shell = SimpleNamespace(journal_command_numbers=lambda *commands: tuple(line_numbers))
    return SimpleNamespace(agent_id=AGENT_ID, event=SimpleNamespace(tool=SimpleNamespace(shell=shell)))


def rule(started=(), answered_at=None, explicit_id=None, focus_id=1, source=FocusSource.DEFAULT, plan_ids=(1, 2), waited=()):
    tasks = SimpleNamespace(started_tasks=lambda agent_id: [SimpleNamespace(id=task_id, started_at=started_at) for task_id, started_at in started])
    works = tuple(SimpleNamespace(plan=SimpleNamespace(id=plan_id), unblockers=Unblockers(tuple(Unblocker(task_id, 1, 100) for task_id in waited))) for plan_id in plan_ids)
    current = None if focus_id is None else SimpleNamespace(source=source)
    overview = SimpleNamespace(current=current, started=works, focus_work=next((work for work in works if work.plan.id == focus_id), None))
    focus = SimpleNamespace(explicit_plan_id=lambda agent: explicit_id, overview=lambda agent: overview)
    history = SimpleNamespace(last_answer=lambda name, hook: answered_at)
    return PlanFocusRule(SimpleNamespace(query=lambda model: PlaceRows()), tasks, focus, history)


def texts(answer):
    return [nudge.text for nudge in answer.nudges]


def test_a_plan_task_started_with_two_started_plans_and_no_focus_of_its_own_names_the_plans_and_the_default():
    assert texts(rule(started=[(11, 5)]).answer(hook())) == ["Plans 1, 2 started; your default focus is plan 1"]


def test_starting_a_plan_while_another_is_started_names_the_plans_too():
    assert texts(rule().answer(hook(line_numbers=[2]))) == ["Plans 1, 2 started; your default focus is plan 1"]


def test_a_started_task_of_another_plan_than_the_focus_the_agent_named_is_named_with_both_plans():
    answer = rule(started=[(12, 5)], explicit_id=1, source=FocusSource.EXPLICIT).answer(hook())
    assert texts(answer) == ["Task 12 belongs to plan 2; your focus is plan 1"]


@pytest.mark.parametrize("changes", [
    dict(started=[(11, 5)], plan_ids=tuple([1])),
    dict(started=[(99, 5)]),
    dict(started=[(11, 5)], answered_at=6),
    dict(started=[(11, 5)], explicit_id=1, source=FocusSource.EXPLICIT),
    dict(started=[(12, 5)], explicit_id=1, source=FocusSource.EXPLICIT, waited=[12]),
    dict(started=[(11, 5)], focus_id=None),
    dict(),
], ids=["one started plan", "a task outside any plan", "a task this rule spoke of", "a task of the focus the agent named",
        "a task the focus waits on", "no plan has work for the agent", "an agent with no started task"])
def test_nothing_is_said(changes):
    assert texts(rule(**changes).answer(hook())) == []


def test_a_task_started_with_no_tool_call_of_the_agent_is_named_at_its_next_tool_call_and_once():
    assert len(texts(rule(started=[(11, 5)], answered_at=4).answer(hook()))) == 1
    assert texts(rule(started=[(11, 5)], answered_at=5).answer(hook())) == []
