from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_options import WorkersOptions
from tests.stories.fixtures.main.orchestrator_worker import OrchestratorWorker
from tests.stories.fixtures.state_fixture import StateFixture

PASSING_TESTS = "#!/bin/sh\necho '1 passed'\n"


class ReviewerAtWork(StateFixture):
    """With a reviewer and a test command on in orchestrator mode, the working worker proved both points and clocked out naming its tests, which the journal ran and saw pass, so the journal sent a reviewer on its work, whose session started: story.agents.reviewers.first()."""

    stack = (Orchestrating,)

    parent = OrchestratorWorker

    settings = ((ReviewingOptions.REVIEWER, True), (WorkersOptions.TEST_COMMAND, "./run_tests.sh"))

    def steps(self, story) -> None:
        story.project_script_holding("run_tests.sh", PASSING_TESTS)
        story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
        story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
        story.agent_runs_cleanly(story.agents.workers.first(), "clock-out 'the parser is done' --tests parser_story.py")
        self.reviewers.first = story.newest("reviewers")
        story.agent_starts_a_session(story.agents.reviewers.first())

    def expected(self, story) -> None:
        story.expect_stack(story.agents.main, Orchestrating)
