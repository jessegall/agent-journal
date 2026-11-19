from journal.engine.states.ended import Ended
from journal.engine.states.void import Void
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.models.worker_state import WorkerState
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.worker_holding_a_test_turn import WorkerHoldingATestTurn

PASSING_SCRIPT = "#!/bin/sh\necho '1 passed'\n"
FAILING_SCRIPT = "#!/bin/sh\necho 'FAILED test_parser.py::test_reads - assert 1 == 2'\necho '1 failed'\nexit 1\n"


@story(WorkerHoldingATestTurn, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
@setting(WorkersOptions.CLOCK_OUT_FOREGROUND_SECONDS, 0)
def test_a_clock_out_waiting_for_a_test_turn_answers_at_once_lets_the_run_end_unflagged_and_hands_the_work_in_once_the_tests_pass(story):
    story.project_script_holding("run_tests.sh", PASSING_SCRIPT)
    story.worker_test_run_ends_after(story.agents.subject, 1.0)
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    result.expect_command_passed()
    result.expect_command_text("your clock-out continues on the journal: its test turn")
    story.expect_worker(story.agents.subject, state=WorkerState.CLOCKING_OUT)
    story.expect_stack(story.agents.subject, Void)
    result = story.worker_run_ends_with_its_session(story.agents.subject, "my clock-out continues on the journal")
    result.expect_agent_not_told(story.agents.main, WorkersNudges.RUN_UNFINISHED)
    story.expect_worker(story.agents.subject, state=WorkerState.CLOCKING_OUT)
    result = story.worker_clock_out_ends_in_the_journal(story.agents.subject)
    result.expect_agent_told(story.agents.main, WorkersNudges.WORK_READY)
    story.expect_worker(story.agents.subject, state=WorkerState.DELIVERED)
    story.expect_no_test_turn_open()
    story.expect_stack(story.agents.subject, Void, Ended)


@story(WorkerHoldingATestTurn, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
@setting(WorkersOptions.CLOCK_OUT_FOREGROUND_SECONDS, 0)
def test_a_clock_out_that_fails_in_the_journal_sends_the_ended_worker_back_in_its_session_with_the_failing_lines(story):
    story.worker_test_run_ends_after(story.agents.subject, 2.0)
    story.project_script_holding("run_tests.sh", FAILING_SCRIPT)
    story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    story.worker_run_ends_with_its_session(story.agents.subject, "my clock-out continues on the journal")
    result = story.worker_clock_out_ends_in_the_journal(story.agents.subject)
    result.expect_agent_not_told(story.agents.main, WorkersNudges.RUN_UNFINISHED)
    story.expect_worker(story.agents.subject, state=WorkerState.DISPATCHED)
    story.expect_worker_brief_holding(story.agents.subject, "did not stand", "your tests did not pass", "1 failed")
    story.expect_stack(story.agents.subject, Void, Ended)
