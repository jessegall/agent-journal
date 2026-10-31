from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined


def test_a_phrase_trigger_tells_the_agent_its_text_when_the_users_prompt_holds_a_phrase(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('trigger make "deploy, release" "Run the release sequence"', "trigger 1: deploy, release -> nudge", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.prompt("please release it"), "Run the release sequence")


def test_a_deny_trigger_refuses_a_tool_call_that_holds_its_phrase(new_story):
    story = new_story(fixture=UserJoined)
    story.run('trigger make "rm -rf" "never remove folders" --do deny', actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.prompt("rm -rf build"), "a trigger denies this: never remove folders")


def test_a_scheduled_trigger_fires_once_its_time_comes_and_ends_after_its_times(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text('trigger schedule "Check the build" --every 30 --times 1', "next at", actor=story.user)
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed("s-1", HookSamples.stop(), "Check the build")
    story.expect_absent("trigger list", "Check the build", actor=story.user)


def test_a_scheduled_trigger_needs_a_time(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('trigger schedule "Check the build"', "a scheduled trigger needs --at, --every or --cron", actor=story.user)


def test_strike_ends_a_trigger(new_story):
    story = new_story(fixture=UserJoined)
    story.run('trigger make "deploy" "Run the release sequence"', actor=story.user)
    story.expect_text("trigger strike 1", "trigger 1 struck", actor=story.user)
    story.expect_absent("trigger list", "deploy", actor=story.user)
