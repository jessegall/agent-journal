from journal.features.checks.checks_nudges import ChecksNudges
from journal.features.tasks.states.ready import Ready
from tests.stories.fixtures.main.working_agent import WorkingAgent
from tests.stories.fixtures.state_fixture import StateFixture


class CheckThatCouldNotRun(StateFixture):
    """The agent at work created a check that exits 2 and ran it once, and was told it could not run: story.checks.probe."""

    stack = (Ready,)

    parent = WorkingAgent

    def steps(self, story) -> None:
        story.agent_runs(story.agents.main, "check create probe --command 'exit 2' --brief 'the probe reaches production'")
        self.checks.probe = story.created_number("check")
        story.agent_runs(story.agents.main, f"check run {self.checks.probe}")

    def expected(self, story) -> None:
        story.last_step.expect_agent_told(story.agents.main, ChecksNudges.CHECK_COULD_NOT_RUN, n=self.checks.probe)
        story.last_step.expect_agent_not_told(story.agents.main, ChecksNudges.CHECK_FAILED, n=self.checks.probe)
        story.last_step.expect_command_text(f"check {self.checks.probe} could not run")
        story.expect_row("checks", self.checks.probe, {"last_passed": False, "last_fault": "it exited 2: it could not run"})
