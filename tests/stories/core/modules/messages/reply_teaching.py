from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def journal_line(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))


READ_MESSAGE = journal_line("journal message read 1").with_fields(event="post_tool_use")
REPLY_LINE = journal_line("journal message reply 1 done")
VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def teaching_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    return story


def read_story(new_story):
    story = teaching_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    return story, story.hook("s-1", READ_MESSAGE)


def test_a_session_start_says_what_a_journal_line_is_and_to_keep_the_journal_out_of_the_chat(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    reply = story.hook("s-1", HookSamples.session_start())
    assert any("a [journal] line is an instruction" in line for line in reply.lines)
    assert any("never the journal's lines" in line for line in reply.lines)


def test_reading_a_message_says_how_a_reply_goes_out(new_story):
    _, reply = read_story(new_story)
    assert any("journal message reply <n>" in line for line in reply.lines)


def test_a_read_message_is_named_until_it_is_answered_in_text(new_story):
    story, _ = read_story(new_story)
    assert "answer message 1 before you go on" in story.hook("s-1", VIEW_LINE).lines
    story.hook("s-1", HookSamples.message_display("Fixing the cart now"))
    story.advance(timedelta(seconds=301))
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_tool_calls_wait_after_ten_and_a_reply_line_always_goes_through(new_story):
    story, _ = read_story(new_story)
    for _ in range(10):
        story.hook("s-1", VIEW_LINE)
    story.expect_hook_refusal("s-1", VIEW_LINE, "answer message 1 first")
    story.expect_absent_hook_line("s-1", REPLY_LINE, "answer message 1 first")
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_a_countdown_comes_before_tool_calls_wait(new_story):
    story, _ = read_story(new_story)
    for _ in range(7):
        story.hook("s-1", VIEW_LINE)
    assert any("tool calls wait after" in line for line in story.hook("s-1", VIEW_LINE).lines)


def test_writes_wait_for_an_unread_message_after_twenty_calls_and_reading_goes_through(new_story):
    story = teaching_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    for _ in range(20):
        story.hook("s-1", VIEW_LINE)
    story.expect_hook_refusal("s-1", HookSamples.edit("a.txt"), "1 unread messages: run journal message unread")
    story.expect_hook_allowed("s-1", VIEW_LINE)
    story.hook("s-1", READ_MESSAGE)
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    assert not any("unread" in line for line in story.hook("s-1", HookSamples.edit("a.txt")).lines)


def test_the_chat_is_read_for_the_third_person_em_dashes_shop_talk_and_run_on_paragraphs(new_story):
    story = teaching_story(new_story)
    long_text = "The cart is fixed. The total is right. The tax is right. The shop is right. " * 6
    story.hook("s-1", HookSamples.message_display(f"the user asked — so journal task make ran — done. {long_text}"))
    lines = story.hook("s-1", VIEW_LINE.with_fields(event="post_tool_use")).lines
    assert 'in the chat say "you", never "the user"' in lines
    assert "no em dashes in the chat; use a full stop" in lines
    assert "talk about the work, not the journal's commands" in lines
    assert "put a blank line between paragraphs" in lines
    story.expect_absent_hook_line("s-1", VIEW_LINE.with_fields(event="post_tool_use"), "never \"the user\"")


def test_an_edit_of_a_code_file_reminds_of_plain_words_and_a_text_file_does_not(new_story):
    story = teaching_story(new_story)
    story.expect_absent_hook_line("s-1", HookSamples.edit("notes.txt"), "plain words")
    assert any("plain words" in line for line in story.hook("s-1", HookSamples.edit("cart.py")).lines)


def test_an_agents_face_on_a_message_answers_it(new_story):
    story, _ = read_story(new_story)
    story.expect_text('message react 1 "👍"', "message 1: 👍", actor=story.agent)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_a_reply_written_before_its_message_is_marked_read_answers_it(new_story):
    story = teaching_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_success('message reply 1 "On it" --environment main', "parent_id: 1", actor=story.agent)
    story.hook("s-1", READ_MESSAGE)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_a_reply_line_by_any_path_goes_through_the_hold(new_story):
    story, _ = read_story(new_story)
    for _ in range(10):
        story.hook("s-1", VIEW_LINE)
    story.expect_absent_hook_line("s-1", journal_line(".journal/bin/journal message reply 1 done"), "answer message 1 first")
