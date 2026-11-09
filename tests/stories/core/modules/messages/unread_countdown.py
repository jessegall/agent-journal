from datetime import timedelta
import pytest

from core.testing.story import Story
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder



@pytest.fixture(autouse=True)
def listeners_run_at_hook(monkeypatch):
    original = Story.hook

    def hook_after_listeners(story, *arguments, **options):
        story.run_listeners()
        story.advance(timedelta(seconds=1))
        return original(story, *arguments, **options)

    monkeypatch.setattr(Story, "hook", hook_after_listeners)


def test_an_unread_message_counts_down_only_in_its_last_tool_uses(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('message send "Read me" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    replies = [story.hook("s-1", HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))) for _ in range(19)]
    story.expect_rows(not any("read message" in line for reply in replies[:10] for line in reply.lines))
    story.expect_rows(any("read message 1" in line for line in replies[-1].lines))
