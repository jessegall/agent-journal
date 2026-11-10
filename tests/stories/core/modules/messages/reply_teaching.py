from core.testing.story import Story
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES
from core.testing.expect_reply import expect_reply_line
from tests.stories.support.story_checks import expect_lines_reply_line



@pytest.fixture(autouse=True)
def listeners_run_at_hook(monkeypatch):
    original = Story.hook

    def hook_after_listeners(story, *arguments, **options):
        story.run_listeners()
        story.clock.advance(timedelta(seconds=1))
        return original(story, *arguments, **options)

    monkeypatch.setattr(Story, "hook", hook_after_listeners)


def journal_line(line):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))


READ_MESSAGE = journal_line("journal message read 1").with_fields(event="post_tool_use")
REPLY_LINE = journal_line("journal message reply 1 done")
VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
CHAINED_LINE = HookSamples.shell("ls && ls && ls", ShellPart("ls", CommandCategory.READ, []), ShellPart("ls", CommandCategory.READ, []), ShellPart("ls", CommandCategory.READ, []))


class ReplySession(StoryFixture):
    parent = SampleSuiteChoice

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))


def reply_story(new_story):
    return new_story(SAMPLES, fixture=ReplySession)


def read_story(new_story):
    story = reply_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    return story, story.hook("s-1", READ_MESSAGE)


@pytest.fixture
def read_message(new_story):
    story, reply = read_story(new_story)
    story.run_listeners()
    return story, reply


def test_a_session_start_says_what_a_journal_line_is_and_to_keep_the_journal_out_of_the_chat(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    reply = story.hook("s-1", HookSamples.session_start())
    expect_reply_line(reply, "a [journal] line is an instruction")
    expect_reply_line(reply, "never the journal's lines")


def test_reading_a_message_says_how_a_reply_goes_out(read_message):
    _, reply = read_message
    expect_lines_reply_line(reply, "reply first")


def test_a_read_message_is_named_until_it_is_answered_in_text(read_message):
    story, _ = read_message
    story.expect_hook_allowed("s-1", VIEW_LINE, "answer message 1 before you go on")
    story.hook("s-1", HookSamples.message_display("Fixing the cart now"))
    story.advance(timedelta(seconds=301))
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_filing_the_task_a_message_asks_for_is_not_told_to_answer_it(read_message):
    story, _ = read_message
    task_part = ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "Fix the cart"], subcommand="task")
    reply = ShellPart("journal", CommandCategory.JOURNAL, ["message", "reply", "1", "on it"], subcommand="message")
    story.expect_absent_hook_line("s-1", HookSamples.shell('journal task make "Fix the cart"', task_part), "answer message 1")
    story.expect_absent_hook_line("s-1", HookSamples.shell("journal message reply 1 'on it'", reply), "answer message 1")


def test_tool_calls_wait_after_ten_and_a_reply_line_always_goes_through(reply_required):
    story = reply_required
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "answer message 1 first")
    story.expect_absent_hook_line("s-1", REPLY_LINE, "answer message 1 first")
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_a_chained_command_is_held_only_after_ten_tool_uses_and_not_before(chained_reply_countdown):
    story = chained_reply_countdown
    for _ in range(2):
        story.hook("s-1", CHAINED_LINE)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "answer message 1 first")


def test_writes_wait_for_an_unread_message_after_twenty_calls_and_reading_goes_through(new_story):
    story = new_story(SAMPLES, fixture=AnnouncedCartMessage)
    for _ in range(21):
        story.hook("s-1", VIEW_LINE)
    story.expect_hook_refusal("s-1", HookSamples.edit("a.txt"), "1 unread messages: read them")
    story.expect_hook_allowed("s-1", VIEW_LINE)
    story.hook("s-1", READ_MESSAGE)
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", HookSamples.edit("a.txt"), "unread")


def test_the_chat_is_read_for_the_third_person_em_dashes_shop_talk_and_run_on_paragraphs(new_story):
    story = reply_story(new_story)
    long_text = "The cart is fixed. The total is right. The tax is right. The shop is right. " * 6
    story.hook("s-1", HookSamples.message_display(f"the user asked — so journal task make ran — done. {long_text}"))
    lines = story.hook("s-1", VIEW_LINE.with_fields(event="post_tool_use"))
    expect_reply_line(lines, 'in the chat say "you", never "the user"')
    expect_reply_line(lines, "no em dashes in the chat; use a full stop")
    expect_reply_line(lines, "talk about the work, not the journal's commands")
    expect_reply_line(lines, "put a blank line between paragraphs")
    story.expect_absent_hook_line("s-1", VIEW_LINE.with_fields(event="post_tool_use"), "never \"the user\"")


def test_an_edit_of_a_code_file_reminds_of_plain_words_and_a_text_file_does_not(new_story):
    story = reply_story(new_story)
    story.expect_absent_hook_line("s-1", HookSamples.edit("notes.txt"), "plain words")
    story.expect_hook_allowed("s-1", HookSamples.edit("cart.py"), "plain words")


def test_an_agents_face_on_a_message_answers_it(read_message):
    story, _ = read_message
    story.expect_text('message react 1 "👍"', "message 1: 👍", actor=story.agent)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


def test_a_reply_written_before_its_message_is_marked_read_answers_it(new_story):
    story = new_story(SAMPLES, fixture=AnnouncedCartMessage)
    story.expect_success('message reply 1 "On it" --environment main', "parent_id: 1", actor=story.agent)
    story.hook("s-1", READ_MESSAGE)
    story.expect_absent_hook_line("s-1", VIEW_LINE, "answer message 1")


@pytest.fixture
def chained_reply_countdown(read_message):
    story, _ = read_message
    for _ in range(8):
        story.hook("s-1", CHAINED_LINE)
    return story


@pytest.fixture
def reply_countdown(read_message):
    story, _ = read_message
    for _ in range(8):
        story.hook("s-1", VIEW_LINE)
    return story


@pytest.fixture
def reply_required(reply_countdown):
    story = reply_countdown
    for _ in range(3):
        story.hook("s-1", VIEW_LINE)
    return story


class AnnouncedCartMessage(StoryFixture):
    parent = ReplySession

    def steps(self, story):
        story.run('message send "Fix the cart first" --environment main', actor=story.user)
        story.hook('s-1', HookSamples.stop())


def test_a_takeover_holds_the_new_agent_only_for_messages_it_read_itself(read_message):
    story, _ = read_message
    story.hook("s-2", HookSamples.session_start())
    story.expect_absent_hook_line("s-2", VIEW_LINE, "answer message 1")
    story.run('message send "Then the totals" --environment main', actor=story.user)
    story.hook("s-2", HookSamples.stop())
    story.hook("s-2", journal_line("journal message read 2").with_fields(event="post_tool_use"))
    story.expect_hook_allowed("s-2", VIEW_LINE, "answer message 2 before you go on")
    story.expect_absent_hook_line("s-2", VIEW_LINE, "answer message 1")
