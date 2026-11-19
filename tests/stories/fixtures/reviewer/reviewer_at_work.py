from journal.features.reviewing.reviewing_options import ReviewingOptions
from journal.features.workers.states.orchestrating import Orchestrating
from tests.stories.fixtures.main.orchestrator_worker import OrchestratorWorker
from tests.stories.fixtures.state_fixture import StateFixture


class ReviewerAtWork(StateFixture):
    """With a reviewer on in orchestrator mode, the working worker proved both points and clocked out, so the journal sent a reviewer on its work, whose session started: story.agents.reviewers.first()."""

    stack = (Orchestrating,)

    parent = OrchestratorWorker

    settings = ((ReviewingOptions.REVIEWER, True),)

    def steps(self, story) -> None:
        story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
        story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
        story.agent_clocks_out(story.agents.workers.first(), "the parser is done")
        self.reviewers.first = story.newest("reviewers")
        story.agent_starts_a_session(story.agents.reviewers.first())

    def expected(self, story) -> None:
        story.expect_stack(story.agents.main, Orchestrating)
