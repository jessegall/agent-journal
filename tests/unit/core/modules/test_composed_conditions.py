from core.modules.assignments.queries.conditions.assignee_among import AssigneeAmong
from core.modules.assignments.queries.conditions.unassigned import Unassigned
from core.modules.chat.queries.conditions.mark_round_key import MarkRoundKey
from core.modules.docking.conditions.same_chat import SameChat
from core.modules.messages.conditions.main_message_target import MainMessageTarget
from core.modules.messages.conditions.message_target import MessageTarget
from core.modules.plans.conditions.plan_tasks_condition import PlanTasksCondition
from core.modules.plans.conditions.shared_plan_tasks import SharedPlanTasks
from core.modules.reminders.conditions.non_helper_rows import NonHelperRows
from core.modules.tasks.conditions.closed_task_cursor import ClosedTaskCursor
from core.modules.tasks.conditions.takeable_tasks import TakeableTasks
from core.modules.tasks.conditions.unfinished_task_holder import UnfinishedTaskHolder
from core.modules.tasks.models.task import Task
from core.modules.templates.conditions.excluded_template_modules import ExcludedTemplateModules
from core.modules.templates.conditions.template_target import TemplateTarget

"""Story 43 of doc 1255: a module condition is composed of builder conditions and writes the same statement it wrote
by hand; a role literal became a parameter."""

PLACED = "SELECT phase_tasks.task_id FROM phase_tasks JOIN phases ON phases.id = phase_tasks.phase_id WHERE"


def said(condition) -> tuple[str, list[object]]:
    statement = condition.statement()
    return " ".join(statement.sql.split()), list(statement.parameters)


def test_task_conditions_write_the_statements_they_wrote_by_hand():
    assert said(UnfinishedTaskHolder()) == ("id IN (SELECT delegated_to FROM tasks WHERE closed_at IS NULL AND delegated_to IS NOT NULL AND state IN (?, ?, ?))", ["open", "started", "testing"])
    assert said(TakeableTasks(4, True)) == ("(state = ? AND (delegated_to IS NULL OR delegated_to IN (SELECT id FROM agents WHERE role = ?)))", ["open", "main"])
    assert said(TakeableTasks(4, False)) == ("(state = ? AND delegated_to = ?)", ["open", 4])
    assert said(ClosedTaskCursor("2026", 9)) == ("(closed_at, id) < (?, ?)", ["2026", 9])


def test_message_and_reminder_conditions_write_the_statements_they_wrote_by_hand():
    assert said(MessageTarget(3)) == ("(target_agent_id = ? OR (target_agent_id IS NULL AND EXISTS (SELECT 1 FROM agents WHERE id = ? AND role = ?)))", [3, 3, "main"])
    assert said(MainMessageTarget()) == ("(target_agent_id IS NULL OR target_agent_id IN (SELECT id FROM agents WHERE role = ?))", ["main"])
    assert said(NonHelperRows()) == ("creator_id NOT IN (SELECT id FROM agents WHERE role IS NOT ?)", ["main"])


def test_assignment_and_chat_conditions_write_the_statements_they_wrote_by_hand():
    assert said(AssigneeAmong(Task, (7, 8))) == ("id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id IN (?, ?))", ["task", 7, 8])
    assert said(Unassigned(Task)) == ("id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = ?)", ["task"])
    assert said(MarkRoundKey("plans.mark")) == ("(key = ? OR key GLOB ?)", ["plans.mark", "plans.mark:round:*"])


def test_plan_docking_and_template_conditions_write_the_statements_they_wrote_by_hand():
    assert said(PlanTasksCondition((3,))) == (f"id IN ({PLACED} phases.plan_id IN (?))", [3])
    assert said(SharedPlanTasks((1,))) == (f"id IN ({PLACED} phases.plan_id IN (SELECT phases.plan_id FROM phase_tasks JOIN phases ON phases.id = phase_tasks.phase_id WHERE phase_tasks.task_id IN (?)))", [1])
    assert said(SameChat(5)) == ("(session_agent_id = ? OR (NOT EXISTS (SELECT 1 FROM agents WHERE id = ? AND role IS NOT ?) AND (session_agent_id IS NULL OR session_agent_id IN (SELECT id FROM agents WHERE role = ?))))", [5, 5, "main", "main"])
    assert said(TemplateTarget("x")) == ("(json_array_length(targets) = 0 OR EXISTS (SELECT 1 FROM json_each(targets) WHERE value = ?))", ["x"])
    assert said(ExcludedTemplateModules(("a",))) == ("NOT (module IN (?))", ["a"])
