from types import SimpleNamespace

import pytest

from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.state_tier import StateTier
from engine.time.timestamp import Timestamp
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.rules.log_request_rule import LogRequestRule
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.rules.support.task_write_count import TaskWriteCount
from core.modules.tasks.rules.task_name_rule import TaskNameRule
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule
from core.modules.tasks.states.started_task import StartedTask

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
STARTED = Timestamp.parsed("2026-11-14T08:00:00+00:00")


class Untouched:
    """Stands for anything a rule would only reach after it found a started task: any use fails."""


def started(tasks: list[Task]) -> SimpleNamespace:
    return SimpleNamespace(started_tasks=lambda agent_id: tuple(tasks))


# a hook that reaches each rule's task read: a control return, a file write, a task move
def hook() -> SimpleNamespace:
    shell = SimpleNamespace(parts_running_journal_command=lambda *commands: True)
    return SimpleNamespace(agent_id=7, control_return=True, event=SimpleNamespace(tool=SimpleNamespace(is_writing_files=lambda: True, shell=shell)))


def no_current() -> CurrentTasks:
    return CurrentTasks(started([]), Untouched(), Untouched())


GATED = [
    lambda: TaskReturnLineRule(no_current()),
    lambda: LogRequestRule(TaskWriteCount(no_current(), Untouched(), Untouched())),
    lambda: UnloggedWriteRule(TaskWriteCount(no_current(), Untouched(), Untouched())),
    lambda: TaskNameRule(Untouched(), no_current()),
    lambda: InactiveTaskReminderRule(no_current(), Untouched(), Untouched(), Untouched(), Untouched()),
    lambda: TaskSummaryLineRule(no_current()),
]


def test_the_state_is_asked_in_place_and_gates_the_task_rules_that_need_a_started_task():
    assert (StartedTask.name, StartedTask.tier) == ("tasks.task-started", StateTier.IN_PLACE)
    assert StartedTask.rules == [TaskReturnLineRule, LogRequestRule, UnloggedWriteRule, TaskNameRule, InactiveTaskReminderRule, TaskSummaryLineRule]


@pytest.mark.parametrize("built", GATED, ids=["where-you-stand", "log-request", "log-before-more-writes", "named-task", "quiet-task", "session-start-summary"])
def test_with_no_started_task_the_state_is_closed_and_each_gated_rule_answers_allowed_alone(built):
    assert StartedTask(started([])).open_rows(hook()) == []
    assert built().answer(hook()) == RuleAnswer.allowed()


def test_a_started_task_opens_the_state_on_it():
    task = Task(id=4, version=1, created_at=CREATED, updated_at=CREATED, creator_id=1, title="Fix it", started_at=STARTED)
    assert StartedTask(started([task])).open_rows(hook()) == [OpenRow("task", 4, STARTED)]
