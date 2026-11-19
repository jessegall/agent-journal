"""Drives git in a throwaway repository of the story's temp folder, so it runs only with JOURNAL_PROCESS_STORIES set, never in the default story run."""
from journal.engine.states.void import Void
from journal.features.workers.states.working_task import WorkingTask
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.worktree_worker import WorktreeWorker


@story(WorktreeWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "false")
def test_a_worktree_worker_that_changed_no_file_clocks_out_without_a_test_run(story):
    story.agent_proves(story.agents.subject, 1, "the report names the rules of the parser")
    story.agent_proves(story.agents.subject, 2, "the report names the names of the parser")
    result = story.agent_runs(story.agents.subject, "clock-out 'nothing to change, the parser already reads the grammar'")
    result.expect_command_passed()
    result.expect_command_text("the journal runs no tests")
    story.expect_task_logged(story.tasks.briefed, "no changes, no tests")
    story.expect_no_test_turn_open()
    story.expect_stack(story.agents.subject, Void)


@story(WorktreeWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "false")
def test_a_worktree_worker_that_changed_a_file_still_has_its_tests_run_at_its_clock_out(story):
    story.worker_commits_a_file_in_its_worktree(story.agents.subject, "test_parser.py", "def test_reads():\n    pass\n")
    story.agent_proves(story.agents.subject, 1, "test_parser.py:1, test_reads passes")
    story.agent_proves(story.agents.subject, 2, "test_parser.py:1, test_reads names the rules")
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests test_parser.py")
    result.expect_command_refused()
    result.expect_command_text("your tests did not pass")
    story.expect_no_test_turn_open()
    story.expect_stack(story.agents.subject, Void, WorkingTask)
