from core.modules.documents.conditions.context_message_type import ContextMessageType
from core.modules.documents.conditions.excludes_plan import ExcludesPlan
from core.modules.documents.conditions.link_counterparts import LinkCounterparts
from core.modules.documents.conditions.link_scope import LinkScope
from core.modules.documents.conditions.link_target import LinkTarget
from core.modules.documents.models.enums.link_side import LinkSide
from core.modules.documents.references.row_ref import RowRef
from engine.query.select import Select
from core.modules.agents.conditions.active_agent_rows import ActiveAgentRows
from core.modules.agents.conditions.kept_agent_rows import KeptAgentRows
from core.modules.agents.conditions.main_agent_rows import MainAgentRows
from core.modules.drivers.conditions.waking_lines import WakingLines
from core.modules.processes.queries.conditions.command_matches import CommandMatches
from core.modules.processes.queries.conditions.kept_output_part import KeptOutputPart
from core.modules.processes.queries.conditions.part_output import PartOutput
from core.modules.processes.queries.conditions.part_run_seconds import PartRunSeconds
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.usage.conditions.agent_activity_condition import AgentActivityCondition
from core.modules.usage.conditions.agent_role_profile_condition import AgentRoleProfileCondition
from core.modules.usage.conditions.ended_agents import EndedAgents
from suites.coding.modules.checks.conditions.interval_passed import IntervalPassed
from suites.coding.modules.checks.queries.conditions.task_wait_command_failure import TaskWaitCommandFailure
from suites.coding.modules.workers.conditions.proof_task_testing import ProofTaskTesting
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
    assert said(UnfinishedTaskHolder()) == ("id IN (SELECT actor_id FROM assignments WHERE subject_model = ? AND subject_id IN (SELECT id FROM tasks WHERE closed_at IS NULL AND state IN (?, ?, ?)))", ["task", "open", "started", "testing"])
    assert said(TakeableTasks(4, True)) == ("(state = ? AND (id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = ?) OR id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id IN (SELECT id FROM agents WHERE role = ?))))", ["open", "task", "task", "main"])
    assert said(TakeableTasks(4, False)) == ("(state = ? AND id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id = ?))", ["open", "task", 4])
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
    assert said(PlanTasksCondition(tuple([3]))) == (f"id IN ({PLACED} phases.plan_id IN (?))", [3])
    assert said(SharedPlanTasks(tuple([1]))) == (f"id IN ({PLACED} phases.plan_id IN (SELECT phases.plan_id FROM phase_tasks JOIN phases ON phases.id = phase_tasks.phase_id WHERE phase_tasks.task_id IN (?)))", [1])
    assert said(SameChat(5)) == ("(session_agent_id = ? OR (NOT EXISTS (SELECT 1 FROM agents WHERE id = ? AND role IS NOT ?) AND (session_agent_id IS NULL OR session_agent_id IN (SELECT id FROM agents WHERE role = ?))))", [5, 5, "main", "main"])
    assert said(TemplateTarget("x")) == ("(json_array_length(targets) = 0 OR EXISTS (SELECT 1 FROM json_each(targets) WHERE value = ?))", ["x"])
    assert said(ExcludedTemplateModules(tuple(["a"]))) == ("NOT (module IN (?))", ["a"])


def test_agent_and_usage_conditions_write_the_statements_they_wrote_by_hand():
    assert said(MainAgentRows()) == ("session_agent_id IN (SELECT id FROM agents WHERE role = ?)", ["main"])
    assert said(KeptAgentRows("agent_id")) == ("agent_id IN (SELECT id FROM agents WHERE retired_at IS NULL)", [])
    assert said(ActiveAgentRows("creator_id")) == ("creator_id IN (SELECT id FROM agents WHERE ended_at IS NULL AND retired_at IS NULL)", [])
    assert said(AgentRoleProfileCondition(["worker"], ["planner"])) == ("(role IN (?) OR coalesce(nullif(profile, ''), job_profile) IN (?))", ["worker", "planner"])
    assert said(AgentActivityCondition({3: "testing"})) == ("((ended_at IS NULL OR id IN (?)) AND retired_at IS NULL)", [3])
    assert said(EndedAgents()) == ("retired_at IS NOT NULL", [])


def test_process_driver_and_suite_conditions_write_the_statements_they_wrote_by_hand():
    assert said(CommandMatches(["pytest*"])) == ("(coalesce(nullif(command, ''), text) GLOB ?)", ["pytest*"])
    assert said(ReaderSampleScope(1, "make")) == ("(process_id IN (SELECT id FROM processes WHERE session_agent_id = ?) AND coalesce(nullif(command, ''), text) = ?)", [1, "make"])
    assert said(PartOutput(2, "make")) == ("EXISTS (SELECT 1 FROM process_parts AS part JOIN processes AS process ON process.id = part.process_id WHERE part.process_id = outputs.process_id AND process.environment_id = ? AND part.text = ?)", [2, "make"])
    assert said(KeptOutputPart()) == ("process_id IN (SELECT outputs.process_id FROM outputs JOIN processes ON processes.id = outputs.process_id WHERE outputs.state = ? AND outputs.line_count > ?)", ["kept", 0])
    assert said(PartRunSeconds(60)) == ("started_at > '' AND ended_at > '' AND (julianday(ended_at) - julianday(started_at)) * 86400 >= ?", [60])
    assert said(WakingLines(["typed"])) == ("(wakes_agent = ? OR source IN (?))", [True, "typed"])
    assert said(TaskWaitCommandFailure()) == ("(instr(last_output, ?) > 0 OR instr(last_output, ?) > 0)", ["not found", "syntax error"])
    assert said(IntervalPassed("2026")) == ("(interval_minutes > ? AND (last_run_at IS NULL OR datetime(last_run_at, '+' || interval_minutes || ' minutes') <= datetime(?)))", [0, "2026"])
    assert said(ProofTaskTesting())[0] == "EXISTS (SELECT 1 FROM tasks WHERE tasks.id = proofs.task_id AND tasks.state = ?)"


def test_document_conditions_write_the_statements_they_wrote_by_hand():
    task, doc = RowRef("task", 3), RowRef("doc", 4)
    assert said(LinkCounterparts(task, tuple([doc]))) == ("(((source_model = ? AND source_id = ? AND target_model = ? AND target_id = ?) OR (target_model = ? AND target_id = ? AND source_model = ? AND source_id = ?)))", ["task", 3, "doc", 4, "task", 3, "doc", 4])
    assert said(LinkCounterparts(task, ())) == ("0", [])
    assert said(LinkScope(task, LinkSide.ROW)) == ("((source_model = ? AND source_id = ?) OR (target_model = ? AND target_id = ?))", ["task", 3, "task", 3])
    assert said(ExcludesPlan(RowRef("plan", 2)))[1] == [2, "task", "task", 2, "phase", "phase"]
    assert said(LinkTarget(task, "doc")) == ("(((source_model = ? AND source_id = ?) AND target_model = ?) OR (NOT ((source_model = ? AND source_id = ?)) AND source_model = ?))", ["task", 3, "doc", "task", 3, "doc"])
    assert said(ContextMessageType(Select("actors").column("id"))) == ("(type IN (?, ?, ?) OR (type = ? AND creator_id IN (SELECT id FROM actors)))", ["user", "comment", "agent", "journal"])
