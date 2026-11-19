from journal.engine.states.void import Void
from journal.features.workers.workers_options import BUILDER_MODE, WorkersOptions
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import setting, story
from tests.stories.fixtures.worker.working_worker import WorkingWorker

PASSING_TESTS = "#!/bin/sh\necho '3 passed'\n"


@story(WorkingWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@setting(WorkersOptions.TEST_COMMAND, "./run_tests.sh")
def test_a_worker_whose_tests_pass_at_clock_out_is_shown_their_result_before_its_clock_out_stands(story):
    story.project_script_holding("run_tests.sh", PASSING_TESTS)
    story.agent_proves(story.agents.subject, 1, "parser.py:12, test_reads passes")
    story.agent_proves(story.agents.subject, 2, "parser.py:30, test_names passes")
    result = story.agent_runs(story.agents.subject, "clock-out 'the parser is done' --tests parser_story.py")
    result.expect_command_passed()
    result.expect_command_lines_in_order("your tests passed, and the agent checking your proofs is handed this result:", "3 passed", "clocked out of task")
    story.expect_stack(story.agents.subject, Void)
