from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions
from journal.models.worker_state import WorkerState
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.main.orchestrator_worker import OrchestratorWorker
from tests.stories.fixtures.main.orchestrator_worker_delivered import OrchestratorWorkerDelivered

ONE_WORKER = 1


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
@setting(WorkersOptions.NEXT_AT_CLOCK_OUT, True)
def test_with_the_next_task_at_clock_out_a_queue_left_at_a_clock_out_to_review_goes_to_a_fresh_worker_named_at_the_stop(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.agent_runs(story.agents.subject, f"worker queue {story.agents.workers.first()} {printer}")
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_runs_cleanly(story.agents.workers.first(), "proof 2 'the names wait for the grammar' --not-done")
    story.agent_clocks_out(story.agents.workers.first(), "the parser reads; the names wait")
    story.expect_worker(story.agents.workers.first(), state=WorkerState.DELIVERED, review_pending=True)
    story.expect_worker(story.newest("workers"), state=WorkerState.DISPATCHED, dispatcher=story.session_of(story.agents.subject))
    story.expect_task(printer, delegated=True)
    result = story.agent_stops(story.agents.subject)
    result.expect_refused(story.agents.subject, WorkersNudges.ACTIVE_WORKERS, numbers=str(story.newest("workers")))
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
def test_with_the_next_task_at_clock_out_off_a_queue_left_at_a_clock_out_waits_for_the_merge(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    story.agent_runs(story.agents.subject, f"worker queue {story.agents.workers.first()} {printer}")
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_runs_cleanly(story.agents.workers.first(), "proof 2 'the names wait for the grammar' --not-done")
    story.agent_clocks_out(story.agents.workers.first(), "the parser reads; the names wait")
    story.expect_row_count("workers", ONE_WORKER)
    story.expect_task(printer, delegated=True)
    story.expect_stack(story.agents.subject, Orchestrating)


@story(OrchestratorWorker, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(ReviewingOptions.REVIEWER, True)
@setting(WorkersOptions.NEXT_AT_CLOCK_OUT, True)
def test_a_task_queued_to_a_worker_in_review_goes_to_a_fresh_worker_at_once_and_a_send_back_still_reaches_the_first(story):
    story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
    story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
    story.agent_clocks_out(story.agents.workers.first(), "the parser is done")
    story.worker_run_ends_with_its_session(story.agents.workers.first(), "the parser is done")
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    result = story.agent_runs(story.agents.subject, f"worker queue {story.agents.workers.first()} {printer}")
    result.expect_command_text("took task")
    story.expect_worker(story.newest("workers"), state=WorkerState.DISPATCHED)
    story.expect_task(printer, delegated=True)
    result = story.agent_runs(story.agents.subject, f"worker check {story.agents.workers.first()} 1 --short 'name the test file'")
    result.expect_agent_told(story.agents.subject, WorkersNudges.PROOF_REJECTED, n=story.agents.workers.first(), point=1)
    story.expect_worker(story.agents.workers.first(), state=WorkerState.DISPATCHED)
    story.expect_stack(story.agents.subject, Orchestrating, ExternalWait)


@story(OrchestratorWorkerDelivered, mode=ORCHESTRATOR_MODE, subject=AgentRole.MAIN)
@setting(WorkersOptions.WORKER_LIMIT, 1)
@setting(WorkersOptions.NEXT_AT_CLOCK_OUT, True)
def test_with_the_next_task_at_clock_out_only_running_workers_take_a_place(story):
    printer = story.agent_creates_briefed_task(story.agents.subject, "the printer", "- prints each rule")
    result = story.agent_runs(story.agents.subject, f"worker dispatch 'Mr. Babbage' --task {printer} --changes 'the printer' --profile journal-medior --model sonnet")
    result.expect_command_passed()
    story.expect_task(printer, delegated=True)
    story.expect_stack(story.agents.subject, Orchestrating, ExternalWait)
