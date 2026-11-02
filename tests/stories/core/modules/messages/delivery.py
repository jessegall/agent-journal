from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.module.module_actors import ModuleActors
from core.base.refusal import Refusal
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


READ_MESSAGE_HOOK = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")
SHOW_MESSAGE_LINE = HookSamples.shell("journal message show 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "show", "1"], subcommand="message"))


def started_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    return story


def delivery_story(new_story):
    story = started_story(new_story)
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
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


def test_a_backlog_of_six_messages_is_told_five_at_a_time_with_the_full_count(new_story):
    story = delivery_story(new_story)
    for number in range(6):
        story.run(f'message send "Message {number}" --environment main', actor=story.user)
    first = story.hook("s-1", HookSamples.stop())
    assert "[journal] 6 new messages: journal message unread" in first.lines
    second = story.hook("s-1", HookSamples.stop())
    assert "[journal] new message 6: journal message read 6" in second.lines


class KeptTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self, working: bool = True) -> None:
        self.typed: list[tuple[int, str]] = []
        self.working = working

    def type_line(self, agent_id: int, line: str) -> None:
        if not self.working:
            raise Refusal("no launcher is running here", "start the agent with journal launch")
        self.typed.append((agent_id, line))


def test_a_message_to_an_agent_at_work_goes_by_its_next_hook_and_nothing_is_typed(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.run('message send "One more thing" --environment main', actor=story.user)
    assert typing.typed == []
    assert "[journal] new message 1: journal message read 1" in story.hook("s-1", HookSamples.edit("cart.py")).lines


def test_only_the_first_message_is_typed_to_an_agent_the_stop_hook_let_stop_and_it_is_not_said_again(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))
    story.run('message send "Are you there" --environment main', actor=story.user)
    story.run('message send "Hello" --environment main', actor=story.user)
    assert typing.typed == [(agent.id, "[journal] new message 1: journal message read 1")]
    woken = story.hook("s-1", HookSamples.prompt("[journal] new message 1: journal message read 1")).lines
    assert "[journal] new message 2: journal message read 2" in woken
    assert not any("new message 1" in line for line in woken)


def test_a_fresh_session_that_has_not_been_given_a_prompt_is_idle_too(new_story):
    story = started_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.run('message send "Are you there" --environment main', actor=story.user)
    assert [line for _, line in typing.typed] == ["[journal] new message 1: journal message read 1"]


def test_a_refused_stop_is_not_idle_since_the_agent_goes_on(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.run('message send "First" --environment main', actor=story.user)
    assert story.hook("s-1", HookSamples.stop()).refusal
    story.run('message send "Second" --environment main', actor=story.user)
    assert typing.typed == []


def test_a_paused_agent_that_is_idle_is_typed_a_message_so_the_user_can_chat(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))
    story.run(f"agent pause {agent.id}", actor=story.user)
    typing.typed.clear()
    story.run('message send "Are you there" --environment main', actor=story.user)
    assert typing.typed == [(agent.id, "[journal] new message 1: journal message read 1")]


def test_an_agent_waiting_on_a_question_is_woken_by_a_new_message(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.run('question ask "Which database?" --environment main', actor=story.agent)
    agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))
    story.run('message send "Use sqlite" --environment main', actor=story.user)
    assert typing.typed == [(agent.id, "[journal] new message 1: journal message read 1")]


def test_with_no_terminal_the_line_waits_for_the_next_hook(new_story):
    story = delivery_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping(working=False))
    story.hook("s-1", HookSamples.stop())
    story.run('message send "Are you there" --environment main', actor=story.user)
    assert "[journal] new message 1: journal message read 1" in story.hook("s-1", HookSamples.prompt("Carry on")).lines


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


def test_a_stop_is_refused_while_a_message_is_unread_and_goes_through_once_it_is_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "message 1 is unread: journal message read 1")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_hook_allowed("s-1", HookSamples.stop())


ACT_ON_IT = "act on what you read:"


def test_reading_a_message_shows_only_its_text_and_marks_it_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    assert story.run("message read 1", actor=story.user).output_text.strip() == "Fix the cart first"
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_only_read_tells_the_agent_how_to_act_and_only_the_first_time(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    reply = story.hook("s-1", READ_MESSAGE_HOOK)
    line = next(line for line in reply.lines if line.startswith(ACT_ON_IT))
    assert "steering" in line and "update" in line
    assert not any(line.startswith(ACT_ON_IT) for line in story.hook("s-1", READ_MESSAGE_HOOK).lines)


def test_the_agent_cannot_show_a_message_it_has_not_read_and_is_told_to_read_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.expect_hook_refusal("s-1", SHOW_MESSAGE_LINE, "message 1 is unread, so it cannot be shown: journal message read 1")
    assert "read_at: 2026" not in story.run("message show 1", actor=story.user).output_text


def test_the_agent_can_show_a_message_once_it_has_read_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", READ_MESSAGE_HOOK)
    assert "is unread" not in story.hook("s-1", SHOW_MESSAGE_LINE).refusal


def test_the_agent_can_show_its_own_message(new_story):
    story = delivery_story(new_story)
    story.run('message send "On it" --environment main', actor=story.agent)
    assert "is unread" not in story.hook("s-1", SHOW_MESSAGE_LINE).refusal


def test_a_reply_read_names_the_message_it_replies_on(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.run('message reply 1 "And the totals"', actor=story.user)
    assert story.run("message read 2", actor=story.user).output_text.splitlines() == ["And the totals", "reply on: message:1"]


def test_a_reply_lands_in_the_environment_of_the_message_it_answers(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.expect_success('message reply 1 "And the totals"', "created: message:2", actor=story.user)
    environment_line = next(line for line in story.run("message show 1", actor=story.user).output_text.splitlines() if line.startswith("environment_id"))
    story.expect_text("message show 2", environment_line, actor=story.user)


def test_a_comment_read_names_its_text_once_and_the_other_links_under_it(new_story):
    story = delivery_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('report make "The totals" --abstract "The totals" --body "Sums" --environment main', actor=story.agent)
    story.run('report comment 1 "See task:1 for this" --environment main', actor=story.user)
    story.run_listeners()
    lines = story.run("message read 1", actor=story.user).output_text.splitlines()
    assert lines[1] == "comment on: report:1"
    assert not any("report:1" in line for line in lines[2:])


def test_a_message_read_through_the_runners_rewritten_line_is_marked_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    rewritten = "JOURNAL_AGENT_SESSION=s-1 .journal/bin/journal-run --process 1 --limit 0 -- 'journal message read 1'"
    story.hook("s-1", HookSamples.shell(rewritten, ShellPart("journal-run", CommandCategory.UNKNOWN, ["--process", "1"])).with_fields(event="post_tool_use"))
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_a_message_with_an_image_tells_the_agent_to_look_at_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "Look at this" --environment main', actor=story.user)
    story.container.get(Database).connection.execute("UPDATE messages SET files = ? WHERE id = 1", ['["shot.png", "notes.txt"]'])
    lines = story.hook("s-1", READ_MESSAGE_HOOK).lines
    assert any(line.startswith("message 1 attaches an image: open") and line.endswith('then journal message tag 1 "shot.png" "<what it shows>"') for line in lines)
    assert not any("notes.txt" in line and "attaches an image" in line for line in lines)


def test_a_tagged_image_is_not_asked_for_again_and_a_missing_file_is_refused(new_story):
    story = delivery_story(new_story)
    story.run('message send "Look at this" --environment main', actor=story.user)
    story.container.get(Database).connection.execute("UPDATE messages SET files = ? WHERE id = 1", ['["shot.png"]'])
    story.expect_refusal('message tag 1 "other.png" "a cart"', "has no file other.png", actor=story.agent)
    story.run('message tag 1 "shot.png" "the cart with a wrong total"', actor=story.agent)
    assert not any("attaches an image" in line for line in story.hook("s-1", READ_MESSAGE_HOOK).lines)


UNREAD_MESSAGE_HOOK = HookSamples.shell("journal message unread", ShellPart("journal", CommandCategory.JOURNAL, ["message", "unread"], subcommand="message")).with_fields(event="post_tool_use")


def test_unread_prints_every_unread_message_and_marks_them_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.run('message send "And the totals" --environment main', actor=story.user)
    reply = story.hook("s-1", HookSamples.stop())
    assert "[journal] 2 new messages: journal message unread" in reply.lines
    text = story.run("message unread --environment main", actor=story.user).output_text
    assert "message 1:\nFix the cart" in text and "message 2:\nAnd the totals" in text
    lines = story.hook("s-1", UNREAD_MESSAGE_HOOK).lines
    assert sum(line.startswith(ACT_ON_IT) for line in lines) == 1
    story.expect_text("message show 2", "read_at: 2026", actor=story.user)


def test_the_main_chat_leaves_out_the_marks_of_a_worker(new_story):
    story = delivery_story(new_story)
    main_id = story.container.get(Database).rows(Statement("SELECT id FROM agents WHERE session = 's-1'"))[0]["id"]
    worker = hook_agent(story, story.hook("s-2", HookSamples.session_start()))
    story.container.get(Database).connection.execute("UPDATE agents SET role = 'worker' WHERE id = ?", [worker.id])
    bus, module = story.container.get(Bus), story.container.get(ModuleActors).actor("journal.core.processes")
    bus.run(ShowMark(1, ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-main", "From the builder", agent_id=main_id), module, environment_id=1)
    bus.run(ShowMark(1, ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-worker", "From the worker", agent_id=worker.id), module, environment_id=1)
    bus.run(ShowMark(1, ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-nobody", "From the journal"), module, environment_id=1)
    text = story.run("chat-mark main --environment main --json", actor=story.user).output_text
    assert "From the builder" in text and "From the journal" in text and "From the worker" not in text


def test_a_line_that_only_mentions_the_command_marks_nothing_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    mention = HookSamples.shell('grep -rn "journal message unread" src', ShellPart("grep", CommandCategory.SEARCH, ["-rn"])).with_fields(event="post_tool_use")
    story.hook("s-1", mention)
    assert "read_at: 2026" not in story.run("message show 1", actor=story.user).output_text


def test_a_message_not_yet_announced_is_not_marked_read_by_unread(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.hook("s-1", UNREAD_MESSAGE_HOOK.with_fields(event="post_tool_use"))
    story.run('message send "And the totals" --environment main', actor=story.user)
    assert "read_at: 2026" not in story.run("message show 2", actor=story.user).output_text


def test_editing_a_message_the_agent_read_names_it_to_the_agent_without_its_text(new_story):
    story = delivery_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping())
    story.run('message send "First words" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.edit("cart.py"))
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_success('message edit 1 --text "Better words"', actor=story.user)
    story.run_listeners()
    lines = story.hook("s-1", HookSamples.edit("cart.py")).lines
    assert "[journal] message 1 updated" in lines
    assert not any("Better words" in line for line in lines)


def test_editing_an_unread_message_says_nothing(new_story):
    story = delivery_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping())
    story.run('message send "First words" --environment main', actor=story.user)
    story.expect_success('message edit 1 --text "Better words"', actor=story.user)
    story.run_listeners()
    assert not any("updated" in line for line in story.hook("s-1", HookSamples.edit("cart.py")).lines)
