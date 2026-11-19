from journal.engine.states.void import Void
from journal.features.shell.support.shell_runner import RESTART_HOLD
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.queued_worker import QueuedWorker

TEST_SCRIPT = "#!/bin/sh\necho '1 passed'\n"


@story(QueuedWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_clock_out_while_a_restart_waits_starts_no_test_run_so_the_restart_waits_only_on_the_runs_before_it(story):
    story.project_script_holding("run_tests.sh", TEST_SCRIPT)
    story.agent_proves(story.agents.subject, 1, "parser.py:12, test_reads passes")
    result = story.agent_proves(story.agents.subject, 2, "parser.py:30, test_names passes")
    result.expect_command_text(f"your next task, {story.tasks.queued}")
    story.agent_proves(story.agents.subject, 1, "docs.md:4, the docs name the parser")
    output = story.agent_has_a_background_run_printing(story.agents.main, "./scripts/migrate.sh")
    story.user_restarts_the_journal()
    result = story.agent_runs(story.agents.subject, "clock-out 'the queue is done' --tests passing_story.py")
    result.expect_command_refused()
    result.expect_command_text(RESTART_HOLD)
    story.expect_no_test_turn_open()
    story.user_restarts_the_journal()
    story.expect_restart_waiting_on(output)
    story.expect_stack(story.agents.subject, Void, WorkingTask)
