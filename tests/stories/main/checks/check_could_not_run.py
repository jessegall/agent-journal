from journal.features.checks.checks_nudges import ChecksNudges
from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.working_agent import WorkingAgent


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_check_that_exits_2_is_told_once_as_could_not_run_and_never_as_failed(story):
    story.agent_runs(story.agents.subject, "check create probe --command 'exit 2' --brief 'the probe reaches production'")
    check = story.created_number("check")
    result = story.agent_runs(story.agents.subject, f"check run {check}")
    result.expect_agent_told(story.agents.subject, ChecksNudges.CHECK_COULD_NOT_RUN, n=check)
    result.expect_agent_not_told(story.agents.subject, ChecksNudges.CHECK_FAILED, n=check)
    result.expect_command_text(f"check {check} could not run")
    story.expect_row("checks", check, {"last_passed": False, "last_fault": "it exited 2: it could not run"})
    result = story.agent_runs(story.agents.subject, f"check run {check}")
    result.expect_agent_not_told(story.agents.subject, ChecksNudges.CHECK_COULD_NOT_RUN, n=check)
    result.expect_agent_not_told(story.agents.subject, ChecksNudges.CHECK_FAILURE_REPEAT, n=check)
    result = story.agent_runs(story.agents.subject, "check list")
    result.expect_command_text("could not run")
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_check_that_could_not_run_and_then_finds_a_fault_is_told_as_failed(story):
    story.agent_runs(story.agents.subject, "check create probe --command '[ -f probed ] && exit 1; touch probed; exit 2' --brief 'the probe finds nothing wrong'")
    check = story.created_number("check")
    story.agent_runs(story.agents.subject, f"check run {check}")
    result = story.agent_runs(story.agents.subject, f"check run {check}")
    result.expect_agent_told(story.agents.subject, ChecksNudges.CHECK_FAILED, n=check)
    result.expect_command_text(f"check {check} failed")
    story.expect_row("checks", check, {"last_passed": False, "last_fault": ""})
    story.expect_stack(story.agents.subject, Ready)
