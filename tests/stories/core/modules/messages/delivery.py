from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


READ_MESSAGE_HOOK = HookSamples.shell("journal message show 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "show", "1"], subcommand="message")).with_fields(event="post_tool_use")


def delivery_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    return story


def test_the_agent_is_told_the_number_of_a_new_message_and_only_reading_it_marks_it_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    reply = story.hook("s-1", HookSamples.stop())
    assert "[journal] new message 1: journal message read 1" in reply.lines
    assert not any("Fix the cart" in line for line in reply.lines)
    assert "read_at: None" in story.run("message show 1 ", actor=story.user).output_text or "read_at:" not in story.run("message show 1", actor=story.user).output_text
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_text("message show 1", "text: Fix the cart first", "read_at: 2026", actor=story.user)


def test_a_message_is_given_once(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message 1")


def test_the_files_of_a_message_are_named_by_their_path_in_the_line(new_story):
    story = delivery_story(new_story)
    pending = story.home.pending_files / "aaaaaaaaaaaaaaaa"
    pending.mkdir(parents=True)
    (pending / "cart.png").write_bytes(b"png")
    story.run('message send "see this" --file aaaaaaaaaaaaaaaa/cart.png --environment main', actor=story.user)
    assert any(f"file {story.home.message_files(1) / 'cart.png'}" in line for line in story.hook("s-1", HookSamples.stop()).lines)


def test_a_message_of_the_agent_is_not_given_back_to_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "On it" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message")


def test_a_stop_is_refused_while_a_message_is_unread_and_goes_through_once_it_is_shown(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "message 1 is unread: journal message read 1")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_hook_allowed("s-1", HookSamples.stop())


READ_LINE_HOOK = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")
ACT_ON_IT = "act on message 1:"


def test_reading_a_message_shows_only_its_text_and_marks_it_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    assert story.run("message read 1", actor=story.user).output_text.strip() == "Fix the cart first"
    story.hook("s-1", READ_LINE_HOOK)
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_only_read_tells_the_agent_how_to_act_and_only_the_first_time(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    reply = story.hook("s-1", READ_LINE_HOOK)
    line = next(line for line in reply.lines if line.startswith(ACT_ON_IT))
    assert "steering" in line and "update" in line
    assert not any(line.startswith(ACT_ON_IT) for line in story.hook("s-1", READ_LINE_HOOK).lines)


def test_showing_a_message_marks_it_read_but_says_nothing_about_acting(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    assert not any(line.startswith(ACT_ON_IT) for line in story.hook("s-1", READ_MESSAGE_HOOK).lines)
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_a_message_shown_through_the_runners_rewritten_line_is_marked_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    rewritten = "JOURNAL_AGENT_SESSION=s-1 .journal/bin/journal-run --process 1 --limit 0 -- 'journal message show 1'"
    story.hook("s-1", HookSamples.shell(rewritten, ShellPart("journal-run", CommandCategory.UNKNOWN, ["--process", "1"])).with_fields(event="post_tool_use"))
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_a_message_with_an_image_tells_the_agent_to_look_at_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "Look at this" --environment main', actor=story.user)
    story.container.get(Database).connection.execute("UPDATE messages SET files = ? WHERE id = 1", ('["shot.png", "notes.txt"]',))
    lines = story.hook("s-1", READ_LINE_HOOK).lines
    assert any(line.startswith("message 1 attaches an image: open") and line.endswith("shot.png and look at it before you act") for line in lines)
    assert not any("notes.txt" in line and "attaches an image" in line for line in lines)
