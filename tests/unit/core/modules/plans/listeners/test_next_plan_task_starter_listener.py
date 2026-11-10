from types import SimpleNamespace

import pytest

from core.modules.plans.listeners.next_plan_task_starter_listener import NextPlanTaskStarterListener
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.tasks.commands.start_task.start_task import StartTask

MAIN = SimpleNamespace(id=4, role="main", ended_at=None)
ENDED_MAIN = SimpleNamespace(id=5, role="main", ended_at="2026-01-01")
HELPER = SimpleNamespace(id=6, role="helper", ended_at=None)
AGENTS = {agent.id: agent for agent in (MAIN, ENDED_MAIN, HELPER)}


class RecordingBus:
    def __init__(self):
        self.runs = []

    def run(self, command, actor, cause_id=None):
        self.runs.append((command, actor.id))


def listener(bus, plan_state=PlanState.STARTED, focused_id=9, has_started_task=False, urgent=None, exceeds_limit=False, has_assigner=True):
    next_tasks = SimpleNamespace(plan_exclusion=lambda: None)
    tasks = SimpleNamespace(holder=lambda agent_id: SimpleNamespace(started=lambda: SimpleNamespace(exists=lambda: has_started_task)),
                            next_open=lambda excluded_id, exclusion: urgent)
    assigner = SimpleNamespace(exceeds_context_limit=lambda agent_id: exceeds_limit) if has_assigner else None
    plans = SimpleNamespace(find=lambda task_id: None if plan_state is None else SimpleNamespace(id=1, state=plan_state))
    picker = SimpleNamespace(first=lambda agent: None if focused_id is None else SimpleNamespace(id=focused_id))
    rows = SimpleNamespace(required=lambda model, row_id: AGENTS[row_id])
    return NextPlanTaskStarterListener(bus, next_tasks, tasks, SimpleNamespace(assigner=lambda: assigner), plans, picker, rows)


def closed(holder_id):
    previous = None if holder_id is None else SimpleNamespace(holder_id=holder_id)
    return SimpleNamespace(row=SimpleNamespace(id=2), old_row=previous), SimpleNamespace(id=70, actor_id=1)


def test_the_next_task_of_the_focus_is_started_for_the_main_agent_that_held_the_closed_task():
    bus = RecordingBus()
    listener(bus).handle(*closed(MAIN.id))
    assert bus.runs == [(StartTask(9), MAIN.id)]


@pytest.mark.parametrize("holder_id, changes", [
    (MAIN.id, dict(focused_id=None)),
    (MAIN.id, dict(has_started_task=True)),
    (MAIN.id, dict(urgent=SimpleNamespace(priority=400))),
    (MAIN.id, dict(plan_state=PlanState.APPROVED)),
    (MAIN.id, dict(plan_state=None)),
    (MAIN.id, dict(exceeds_limit=True)),
    (MAIN.id, dict(has_assigner=False)),
    (HELPER.id, {}),
    (ENDED_MAIN.id, {}),
    (None, {}),
], ids=["the focus has nothing", "the agent has a started task", "an urgent task waits", "the plan is not started", "the task is in no plan",
        "the agent is past its context limit", "the suite hands out nothing", "the task was another agent's than the main agent's",
        "the main agent has ended", "nobody had the task started"])
def test_nothing_is_started(holder_id, changes):
    bus = RecordingBus()
    listener(bus, **changes).handle(*closed(holder_id))
    assert bus.runs == []
