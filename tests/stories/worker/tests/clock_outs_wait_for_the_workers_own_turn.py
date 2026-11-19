from journal.engine.states.void import Void
from journal.features.shell.support.shell_runner import RESTART_HOLD
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.worker_holding_a_test_turn import WorkerHoldingATestTurn

TEST_SCRIPT = "#!/bin/sh\necho '1 passed'\n"


@story(WorkerHoldingATestTurn, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_clock_out_while_the_workers_own_test_turn_runs_waits_for_it_to_end_and_then_runs_its_tests(story):
    story.project_script_holding("run_tests.sh", TEST_SCRIPT)
    story.worker_test_run_ends_after(story.agents.subject, 0.5)
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    result.expect_command_passed()
    result.expect_agent_told(story.agents.main, WorkersNudges.WORK_READY)
    story.expect_no_test_turn_open()
    story.expect_stack(story.agents.subject, Void)


@story(WorkerHoldingATestTurn, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_clock_out_waiting_for_the_workers_own_test_turn_is_held_by_a_waiting_restart_and_opens_no_turn(story):
    output = story.agent_has_a_background_run_printing(story.agents.main, "./scripts/migrate.sh")
    story.user_restarts_the_journal()
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    result.expect_command_refused()
    result.expect_command_text(RESTART_HOLD)
    story.worker_test_run_ends(story.agents.subject)
    story.expect_no_test_turn_open()
    story.expect_restart_waiting_on(output)
    story.expect_stack(story.agents.subject, Void, WorkingTask)


@story(WorkerHoldingATestTurn, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_second_clock_out_while_the_first_still_runs_is_refused_at_once_while_the_first_hands_in_the_work(story):
    story.project_script_holding("run_tests.sh", TEST_SCRIPT)
    story.worker_clock_out_starts(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    story.worker_test_run_ends_after(story.agents.subject, 1.0)
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests passing_story.py")
    result.expect_command_refused()
    result.expect_command_text("your clock-out continues on the journal: its test turn")
    result = story.worker_clock_out_ends(story.agents.subject)
    result.expect_command_passed()
    result.expect_command_text("clocked out of task")
    story.expect_no_test_turn_open()
    story.expect_stack(story.agents.subject, Void)
