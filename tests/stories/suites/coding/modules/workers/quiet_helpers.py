from datetime import timedelta

from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_settings import INACTIVE_HELPER_MINUTES
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask, SubagentStarted
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
DEFAULT_MINUTES = 5
SUBAGENT_PROMPT = HookSamples.prompt("Read the cart").with_fields(subagent="sub-1")


def minutes(count: int) -> timedelta:
    return timedelta(minutes=count)


def inactive_line(role: str, agent_id: int, count: int = DEFAULT_MINUTES) -> str:
    return f"{role}:{agent_id} has used no tool for {count} minutes"


def line_count(story, line: str) -> int:
    return story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line)


def test_a_worker_that_has_used_no_tool_for_five_minutes_is_named_to_its_main_agent_again_every_five_minutes(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.hook(worker_session(story, worker), HookSamples.prompt("Fix the cart"))
    line = inactive_line("worker", worker.id)
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 1)
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 2)


def test_a_subagent_that_has_used_no_tool_for_five_minutes_is_named_to_its_main_agent_with_a_request_to_check_on_it(new_story):
    story = new_story(fixture=SubagentStarted)
    line = inactive_line("subagent", story.subagent.id)
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"{line}: check on it")


def test_a_subagent_that_used_a_tool_within_the_limit_is_not_named(new_story):
    story = new_story(fixture=SubagentStarted)
    line = inactive_line("subagent", story.subagent.id)
    story.advance(minutes(DEFAULT_MINUTES - 1))
    story.hook(MAIN_SESSION, SUBAGENT_PROMPT)
    story.advance(minutes(DEFAULT_MINUTES - 1))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 0)


def test_a_subagent_that_ended_is_not_named(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_success(f"agent end {story.subagent.id}")
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"subagent:{story.subagent.id} has used no tool") == 0)


def test_a_worker_that_ended_is_not_named(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent end {worker.id}")
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"worker:{worker.id} has used no tool") == 0)


def test_the_setting_sets_how_long_a_helper_is_quiet_before_it_is_named(new_story):
    story = new_story(fixture=SubagentStarted)
    later = DEFAULT_MINUTES * 2
    story.expect_success(f"setting make {INACTIVE_HELPER_MINUTES} {later} --environment main", f"key: {INACTIVE_HELPER_MINUTES}")
    story.advance(minutes(DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"subagent:{story.subagent.id} has used no tool") == 0)
    story.advance(minutes(later - DEFAULT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, inactive_line("subagent", story.subagent.id, later)) == 1)
