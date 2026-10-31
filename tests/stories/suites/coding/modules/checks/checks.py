from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined


def test_a_check_is_made_run_by_hand_and_listed_with_its_verdict(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('check make "Suite" --command "true" --every 0', "check 1: Suite", actor=story.user)
    story.expect_text("check run 1", "check 1 passed: Suite", actor=story.user)
    story.expect_text("check list", "passed", "Suite", actor=story.user)


def test_a_failing_check_prints_its_output_and_tells_the_agent_once(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Lint" --command "echo two problems; false" --every 0', actor=story.user)
    story.expect_text("check run 1", "check 1 failed: Lint", "two problems", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop(), "check 1 failed")


def test_a_removed_check_runs_no_more_and_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.run('check make "Suite" --command "true" --every 0', actor=story.user)
    story.expect_text("check remove 1", "check 1 removed: it runs no more", actor=story.user)
    story.expect_refusal("check remove 1", "check 1 is removed already", actor=story.user)
