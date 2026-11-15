from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
from core.modules.triggers.nudges.trigger_denies_nudge import TriggerDeniesNudge
from core.modules.triggers.nudges.trigger_line_nudge import TriggerLineNudge


def test_a_phrase_trigger_tells_the_agent_its_text_when_the_users_prompt_holds_a_phrase(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('trigger make "deploy, release" "Run the release sequence"', "trigger 1: deploy, release -> nudge", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.prompt("please release it"), TriggerLineNudge.declared().nudge(trigger=1).text)
    story.expect_text("trigger show 1", "Run the release sequence", actor=story.agent)


def test_a_deny_trigger_refuses_a_tool_call_that_holds_its_phrase(new_story):
    story = new_story(fixture=UserJoined)
    story.run('trigger make "rm -rf" "never remove folders" --do deny', actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.prompt("rm -rf build"), TriggerDeniesNudge.declared().nudge(trigger=1).text)


def test_a_scheduled_trigger_fires_once_its_time_comes_and_ends_after_its_times(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text('trigger schedule "Check the build" --every 30 --times 1', "next at", actor=story.user)
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", TriggerLineNudge.declared().nudge(trigger=1).text, actor=story.user)
    story.expect_absent("trigger list", "Check the build", actor=story.user)


def test_a_scheduled_trigger_needs_a_time(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('trigger schedule "Check the build"', "a scheduled trigger needs --at, --every or --cron", actor=story.user)


def test_strike_ends_a_trigger(new_story):
    story = new_story(fixture=UserJoined)
    story.run('trigger make "deploy" "Run the release sequence"', actor=story.user)
    story.expect_text("trigger strike 1", "trigger 1 struck", actor=story.user)
    story.expect_absent("trigger list", "deploy", actor=story.user)


def test_a_trigger_has_its_phrases_action_and_text_changed(new_story):
    story = new_story(fixture=UserJoined)
    story.run('trigger make "deploy" "Run the release sequence"', actor=story.user)
    story.run('trigger edit 1 --phrases "ship it" "go live" --action deny --text "Not on a Friday"', actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.prompt("go live now"), TriggerDeniesNudge.declared().nudge(trigger=1).text)
