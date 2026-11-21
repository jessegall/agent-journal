from journal.features.tasks.states.ready import Ready
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import BUILDER_MODE, ORCHESTRATOR_MODE, WorkersOptions
from journal.models.plan_state import PlanState
from journal.models.worker_state import WorkerState
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.main.briefed_task import BriefedTask
from tests.stories.fixtures.main.orchestrator_open_task import OrchestratorOpenTask
from tests.stories.fixtures.main.orchestrator_two_phase_plan import OrchestratorTwoPhasePlan
from tests.stories.fixtures.main.orchestrator_worker import OrchestratorWorker
from tests.stories.fixtures.main.orchestrator_worker_delivered import OrchestratorWorkerDelivered

NO_WORKER = 0
# places the journal keeps running: the fixture's worker and one more
TWO_PLACES = 2


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, TWO_PLACES)
def test_with_the_journal_dispatching_an_open_task_gets_a_worker_shaped_as_the_last_told_nothing_and_named_at_the_orchestrators_stop(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    result = story.journal_dispatches_the_next_tasks()
    result.expect_agent_told_nothing(story.agents.subject)
    story.expect_worker(story.newest("workers"), state=WorkerState.DISPATCHED, dispatcher=story.session_of(story.agents.subject), profile="journal-medior", worktree=False)
    story.expect_task(printer, delegated=True)
    result = story.agent_stops(story.agents.subject)
    result.expect_refused(story.agents.subject, WorkersNudges.ACTIVE_WORKERS, numbers=f"{story.agents.workers.first()} {story.newest('workers')}")
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorOpenTask, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
def test_with_the_journal_dispatching_off_an_open_task_waits_for_the_orchestrator(story):
    story.journal_dispatches_the_next_tasks()
    story.expect_row_count("workers", NO_WORKER)
    story.expect_task(story.tasks.briefed, delegated=False)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorOpenTask, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
def test_a_task_the_journal_cannot_dispatch_is_left_to_the_orchestrator_marked_manual_with_why_in_its_log(story):
    result = story.journal_dispatches_the_next_tasks()
    result.expect_agent_told_nothing(story.agents.subject)
    story.expect_row_count("workers", NO_WORKER)
    story.expect_task(story.tasks.briefed, delegated=False, manual=True)
    story.expect_task_logged(story.tasks.briefed, "the journal could not dispatch it, so it is left to you")
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorOpenTask, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
def test_a_task_the_orchestrator_keeps_manual_is_passed_over_by_the_journal(story):
    result = story.agent_runs(story.agents.subject, f"task manual {story.tasks.briefed}")
    result.expect_command_text("kept for you to hand out")
    story.journal_dispatches_the_next_tasks()
    story.expect_row_count("workers", NO_WORKER)
    story.expect_task(story.tasks.briefed, delegated=False, manual=True)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, 1)
def test_the_journal_dispatches_no_worker_past_the_workers_it_keeps_running(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=False)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, 1)
def test_clocked_out_work_waiting_for_its_check_takes_no_place_the_journal_fills(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=True)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(BriefedTask, mode=BUILDER_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
def test_in_builder_mode_the_journal_dispatches_nothing_with_its_dispatch_on(story):
    story.journal_dispatches_the_next_tasks()
    story.expect_task(story.tasks.briefed, delegated=False)
    story.expect_stack(story.agents.subject, Ready)


@story(OrchestratorTwoPhasePlan, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
def test_the_journal_starts_the_approved_plan_and_dispatches_its_first_phase_and_not_the_next_one(story):
    story.journal_dispatches_the_next_tasks()
    story.expect_plan(story.plans.first, state=PlanState.STARTED)
    story.expect_task(story.tasks.first_phase, delegated=True)
    story.expect_task(story.tasks.second_phase, delegated=False)
    story.expect_worker(story.newest("workers"), state=WorkerState.DISPATCHED, worktree=True)
    story.expect_stack(story.agents.subject, Orchestrating, OrchestratingPlan)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, TWO_PLACES)
@setting(WorkersOptions.AUTO_DISPATCH_GRACE, 120)
def test_a_task_the_orchestrator_just_made_is_left_for_its_grace_and_dispatched_after_it(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=False)
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=True)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, TWO_PLACES)
def test_a_task_a_clocked_out_worker_holds_keeps_its_delegated_mark(story):
    held = story.newest("tasks")
    story.expect_task(held, delegated=True)
    workers = story.newest("workers")
    story.journal_dispatches_the_next_tasks()
    story.expect_task(held, delegated=True)
    assert story.newest("workers") == workers, "no second worker is sent on a task a clocked-out worker holds"
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, TWO_PLACES)
@setting(WorkersOptions.AUTO_DISPATCH_UNQUEUE, True)
def test_with_places_free_a_task_queued_behind_a_busy_worker_goes_out_to_a_worker_of_its_own(story):
    """On the hosted journal four open tasks sat behind two busy workers while 18 of 30 places stood free (19 Nov)."""
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.agent_runs(story.agents.subject, f"worker queue {story.agents.workers.first()} {printer}")
    story.expect_task(printer, delegated=True)
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=True)
    story.user_sets(WorkersOptions.AUTO_DISPATCH_UNQUEUE_RUNNING, True)
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    story.expect_task_logged(printer, "taken out of a busy worker's queue so a worker of its own takes it")
    story.expect_task(printer, delegated=False)
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    story.expect_task(printer, delegated=True)
    story.expect_worker(story.newest("workers"), state=WorkerState.DISPATCHED)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorTwoPhasePlan, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.AUTO_DISPATCH, True)
@setting(WorkersOptions.AUTO_DISPATCH_LIMIT, 3)
@setting(WorkersOptions.AUTO_DISPATCH_UNQUEUE, True)
@setting(WorkersOptions.AUTO_DISPATCH_UNQUEUE_RUNNING, True)
def test_a_plan_handed_to_one_worker_still_gets_another_worker_for_its_other_task_in_the_phase_at_work(story):
    """Redmar, 19 Nov: one worker doing all of a plan's work is no parallel strategy; a free place takes the plan's next task."""
    header = story.agent_adds_plan_task(story.agents.subject, story.plans.first, "the header")
    story.agent_runs(story.agents.subject, f"plan todos {story.plans.first} 1 {header}")
    plan_worker = story.agent_dispatches_worker_on_plan(story.agents.subject, "Worker 1", story.plans.first)
    story.expect_plan(story.plans.first, state=PlanState.DELEGATED)
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    story.expect_task_logged(header, "taken out of a busy worker's queue")
    story.time_travel(seconds=121)
    story.journal_dispatches_the_next_tasks()
    assert story.newest("workers") != plan_worker, "a second worker is sent"
    story.expect_task(story.tasks.first_phase, delegated=True)
    story.expect_task(header, delegated=True)
    story.expect_task(story.tasks.second_phase, delegated=True)
    assert story.newest("workers") == plan_worker + 1, "the later phase's task stays in the plan worker's queue: one extra worker only"
    story.expect_stack(story.agents.subject, Orchestrating, ExternalWait)
