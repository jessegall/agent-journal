from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithOpenTask, CodingEnvironment


def test_a_builder_that_stops_with_nothing_in_hand_is_started_on_the_open_task(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task 1 is yours now: Fix the cart")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    story.expect_success(lines.SECOND_HOOK_CALL, "hook: stop", "suite: coding", "driver: coding.builder", "answer: refused")


def test_a_builder_with_nothing_open_stops(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_builder_is_told_it_is_the_builder_when_its_session_starts(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "You are the builder")


def test_a_builder_sends_subagents_only_while_its_setting_allows(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", HookSamples.subagent())
    story.run("setting make journal.suites.coding.builder-sends-subagents false")
    story.expect_hook_refusal("s-1", HookSamples.subagent(), "the builder sends no subagents here")
