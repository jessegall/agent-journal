from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined

BUILD = "release v7.18.14 build"
NOTICE = HookSamples.prompt(f"<task-notification>{BUILD} ended</task-notification>")


def monitor_start(description: str):
    command = "journal output monitor 4"
    tool_input = {"command": command, "description": description}
    return HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": tool_input}).with_raw({"tool_input": tool_input})


def test_an_agent_that_started_a_monitor_and_stopped_waits_for_what_the_monitor_describes_until_its_life_ends(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", monitor_start(BUILD))
    story.hook("s-1", HookSamples.stop())
    story.expect_text("usage tool --environment main", f"waiting for {BUILD}", actor=story.user)
    story.advance(timedelta(minutes=31))
    story.expect_absent("usage tool --environment main", BUILD, actor=story.user)


def test_a_notice_from_the_monitor_ends_the_wait_the_line_names(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", monitor_start(BUILD))
    story.advance(timedelta(minutes=1))
    story.hook("s-1", NOTICE)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("usage tool --environment main", BUILD, actor=story.user)


def test_a_monitor_started_after_the_notice_is_named_again(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.prompt("start the release build"))
    story.hook("s-1", monitor_start(BUILD))
    story.advance(timedelta(minutes=1))
    story.hook("s-1", NOTICE)
    story.advance(timedelta(minutes=1))
    story.hook("s-1", monitor_start("journal update"))
    story.hook("s-1", HookSamples.stop())
    story.expect_text("usage tool --environment main", "waiting for journal update", actor=story.user)
