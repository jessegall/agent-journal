from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import UserBuilder

LISTING = HookSamples.shell("ls", ShellPart("ls", "read", []))
LONG_LISTING = HookSamples.shell("ls -l", ShellPart("ls", "read", ["-l"]))


@pytest.fixture(autouse=True)
def listeners_run_at_hook(monkeypatch):
    original = Story.hook

    def hook_after_listeners(story, *arguments, **options):
        story.run_listeners()
        story.advance(timedelta(seconds=1))
        return original(story, *arguments, **options)

    monkeypatch.setattr(Story, "hook", hook_after_listeners)


def test_a_module_starts_a_countdown_in_one_line_and_the_agent_reads_the_same_line_as_before(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('message send "Read me" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    replies = [story.hook("s-1", LISTING) for _ in range(19)]
    lines = [line for line in replies[-1].lines if "read message 1" in line]
    story.expect_rows(len(lines) == 1, "due:" in lines[0] and "tool use" in lines[0], detail=str(replies[-1].lines))


class MessageUnread(StoryFixture):
    """The builder has a message it has not read, and has sent its first prompt."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success('message send "Read me" --environment main', actor=story.user)
        story.hook("s-1", HookSamples.prompt("Carry on"))
