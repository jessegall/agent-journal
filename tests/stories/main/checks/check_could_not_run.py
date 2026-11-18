from journal.features.checks.checks_nudges import ChecksNudges
from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.check_that_could_not_run import CheckThatCouldNotRun


@story(CheckThatCouldNotRun, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_check_that_still_cannot_run_is_not_told_again_and_is_listed_as_could_not_run(story):
    result = story.agent_runs(story.agents.subject, f"check run {story.checks.probe}")
    result.expect_agent_not_told(story.agents.subject, ChecksNudges.CHECK_COULD_NOT_RUN, n=story.checks.probe)
    result.expect_agent_not_told(story.agents.subject, ChecksNudges.CHECK_FAILURE_REPEAT, n=story.checks.probe)
    result = story.agent_runs(story.agents.subject, "check list")
    result.expect_command_text("could not run")
    story.expect_stack(story.agents.subject, Ready)


@story(CheckThatCouldNotRun, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_check_that_could_not_run_and_then_finds_a_fault_is_told_as_failed(story):
    story.agent_runs(story.agents.subject, f"check edit {story.checks.probe} --command 'exit 1'")
    result = story.agent_runs(story.agents.subject, f"check run {story.checks.probe}")
    result.expect_agent_told(story.agents.subject, ChecksNudges.CHECK_FAILED, n=story.checks.probe)
    result.expect_command_text(f"check {story.checks.probe} failed")
    story.expect_row("checks", story.checks.probe, {"last_passed": False, "last_fault": ""})
    story.expect_stack(story.agents.subject, Ready)
