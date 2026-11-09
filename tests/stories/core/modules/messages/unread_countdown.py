from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_an_unread_message_counts_down_only_in_its_last_tool_uses(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('message send "Read me" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    replies = [story.hook("s-1", HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))) for _ in range(18)]
    story.expect_rows(not any("read message" in line for reply in replies[:10] for line in reply.lines))
    story.expect_rows(any("read message 1" in line for line in replies[-1].lines))
