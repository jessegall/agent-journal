import pytest

from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.drivers.queries.hook_call_query import COMPACTION_LIMIT_SECONDS
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from server.booting_work import BootingWork
from tests.stories.core.base.driver.support.fixtures import LeadStarted, SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES
from core.testing.expect_reply import expect_absent_reply_line, expect_absent_reply_refusal, expect_reply_line
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_lines_2, expect_lines_3, expect_refusal_hook, expect_value_with


READ_MESSAGE_HOOK = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")
COMPACTION = HookSamples.sample("compact")
MESSAGE_DISPLAY_HOOK = HookSamples.shell("journal message show 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "show", "1"], subcommand="message"))


def post_message(story, text: str) -> None:
    story.run(f'message send "{text}" --environment main', actor=story.user)


class MessagingSession(StoryFixture):
    parent = SampleSuiteChoice

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        hook_agent(story, story.hook("s-1", HookSamples.session_start()))


class MessagingTurn(StoryFixture):
    parent = MessagingSession

    def steps(self, story):
        story.hook("s-1", HookSamples.prompt("[journal] fix the cart"))


def started_story(new_story):
    return new_story(SAMPLES, fixture=MessagingSession)


def delivery_story(new_story):
    return new_story(SAMPLES, fixture=MessagingTurn)


def test_the_agent_is_told_the_number_of_a_new_message_and_only_reading_it_marks_it_read(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    reply = story.hook("s-1", HookSamples.stop())
    expect_reply_line(reply, "new message 1")
    expect_absent_reply_line(reply, "Fix the cart")
    expect_value_7("read_at: None", story, "message show 1 ", "read_at:", "message show 1")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_text("message show 1", "text: Fix the cart first", "read_at: 2026", actor=story.user)


def test_a_backlog_of_six_messages_is_told_five_at_a_time_with_the_full_count(new_story):
    story = delivery_story(new_story)
    for number in range(6):
        story.run(f'message send "Message {number}" --environment main', actor=story.user)
    first = story.hook("s-1", HookSamples.stop())
    expect_reply_line(first, "6 new messages")
    second = story.hook("s-1", HookSamples.stop())
    expect_reply_line(second, "new message 6")


class KeptTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self, working: bool = True) -> None:
        self.typed: list[tuple[int, str]] = []
        self.working = working

    def type_line(self, agent_id: int, line: str) -> None:
        if not self.working:
            raise Refusal("no launcher is running here", "start the agent with journal launch")
        self.typed.append((agent_id, line))


def test_only_the_first_message_is_typed_to_an_agent_the_stop_hook_let_stop_and_it_is_not_said_again(idle_delivery_typing):
    story, typing = idle_delivery_typing
    agent = story.agent
    post_message(story, "Are you there")
    post_message(story, "Hello")
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])
    delivered_lines = story.hook("s-1", HookSamples.prompt("[journal] new message 1"))
    expect_reply_line(delivered_lines, "new message 2")
    expect_absent_reply_line(delivered_lines, "new message 1")


def test_a_new_message_is_typed_to_an_idle_agent_though_an_older_one_was_told_and_is_unread(idle_delivery_typing):
    story, typing = idle_delivery_typing
    story.advance(timedelta(minutes=1))
    agent = story.agent
    post_message(story, "Are you there")
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.prompt("[journal] new message 1"))
    story.advance(timedelta(minutes=10))
    post_message(story, "Hello")
    story.run_listeners()
    expect_row(typing, typed=[(agent.id, "[journal] new message 1"), (agent.id, "[journal] new message 2")])


def test_a_message_reaches_an_agent_that_waits_on_a_question(new_story):
    story = delivery_story(new_story)
    story.run('question ask "Which one" --context "A story asks this so its card and answer can be checked." --options "a" "b"', actor=story.agent)
    post_message(story, "Are you still there")
    story.expect_hook_allowed("s-1", HookSamples.edit("cart.py"), "new message 1")


def test_a_fresh_session_that_has_not_been_given_a_prompt_is_idle_too(new_story):
    story = started_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    post_message(story, "Are you there")
    expect_terminal_lines(typing, ["[journal] new message 1"])


def test_a_message_to_an_agent_with_no_hook_for_half_a_minute_is_typed_since_an_interrupted_turn_sends_no_stop(delivery_typing):
    story, typing = delivery_typing
    story.hook("s-1", HookSamples.edit("cart.py"))
    story.advance(timedelta(seconds=31))
    post_message(story, "Are you there")
    expect_terminal_lines(typing, ["[journal] new message 1"])


def test_a_message_sent_just_after_an_interrupted_turn_is_typed_at_the_next_tick(delivery_typing):
    story, typing = delivery_typing
    story.hook("s-1", HookSamples.edit("cart.py"))
    post_message(story, "Are you there")
    expect_row(typing, typed=[])
    story.advance(timedelta(seconds=61))
    story.tick("s-1")
    story.run_listeners()
    expect_terminal_lines(typing, ["[journal] new message 1"])


def tool_failure(interrupted: bool):
    return HookSamples.edit("cart.py").with_fields(event="post_tool_use_failure").with_raw({"is_interrupt": interrupted})


def test_a_message_sent_after_a_tool_failed_without_an_interrupt_is_not_typed(delivery_typing):
    story, typing = delivery_typing
    story.hook("s-1", tool_failure(interrupted=False))
    post_message(story, "Are you there")
    expect_row(typing, typed=[])


def test_a_message_sent_after_the_agent_went_on_from_an_interrupt_is_not_typed(delivery_typing):
    story, typing = delivery_typing
    story.hook("s-1", tool_failure(interrupted=True))
    story.hook("s-1", HookSamples.edit("cart.py"))
    post_message(story, "Are you there")
    expect_row(typing, typed=[])


class PromptDuringTerminalLine(KeptTyping):
    """Keeps what would be typed, and the agent's own turn starts the moment the line is typed: its hook comes
    before the listener that typed the line has finished."""

    def __init__(self, story) -> None:
        super().__init__()
        self.story = story

    def type_line(self, agent_id: int, line: str) -> None:
        super().type_line(agent_id, line)
        if len(self.typed) == 1:
            self.story.hook("s-1", HookSamples.prompt(line))


def test_a_line_the_agents_own_hook_took_while_it_was_typed_is_typed_once_and_not_again_after_the_message_is_read(new_story):
    story = new_story(SAMPLES, fixture=StoppedMessagingTurn)
    typing = PromptDuringTerminalLine(story)
    story.container.bind(TerminalTyping, typing)
    post_message(story, "Are you there")
    story.hook("s-1", READ_MESSAGE_HOOK)
    for _ in range(4):
        story.run_listeners()
    expect_terminal_lines(typing, ["[journal] new message 1"])


class HookDuringTerminalLine(KeptTyping):
    """Keeps what would be typed, and a hook of the agent comes while the line is being typed; keeps what it gave."""

    def __init__(self, story) -> None:
        super().__init__()
        self.story = story
        self.hook_lines: list[str] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.hook_lines.extend(self.story.hook("s-1", HookSamples.edit("src/cart.py")).lines)
        super().type_line(agent_id, line)


def test_a_hook_during_the_typing_does_not_give_the_line_too(new_story):
    story = new_story(SAMPLES, fixture=StoppedMessagingTurn)
    typing = HookDuringTerminalLine(story)
    story.container.bind(TerminalTyping, typing)
    agent = story.agent
    post_message(story, "Are you there")
    story.run_listeners()
    expect_terminal_lines(typing, ["[journal] new message 1"])
    expect_hook_lines_typing_without_line(typing, "new message 1")
    story.expect_text(f"agent-line list --agent {agent.id} --state entered", "new message 1", actor=story.user)


def test_a_line_that_could_not_be_typed_goes_to_the_next_hook(untyped_idle_message):
    story = untyped_idle_message
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"), "new message 1")


class BrokenTyping(TerminalTyping):
    """Fails with a fault that is no refusal."""

    def __init__(self) -> None:
        pass

    def type_line(self, agent_id: int, line: str) -> None:
        raise OSError("the launcher's socket broke")


def test_a_line_whose_typing_breaks_goes_to_the_next_hook(new_story):
    story = stopped_lead_story(new_story)
    story.container.bind(TerminalTyping, BrokenTyping())
    post_message(story, "Are you there")
    story.run_listeners()
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"), "new message 1")


def test_a_line_left_in_typing_by_a_stopped_server_waits_again_when_the_journal_starts(untyped_idle_message):
    story = untyped_idle_message
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, state=AgentLineState.WAITING).newest().first()
    story.run(f"agent-line claim {line.id}", actor=story.user)
    story.expect_text(f"agent-line list --agent {story.agent.id} --state typing", "new message 1", actor=story.user)
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "new message 1", actor=story.user)


def test_a_line_left_in_typing_by_a_stopped_server_for_a_message_read_meanwhile_is_not_given_after_the_journal_starts(untyped_idle_message):
    story = untyped_idle_message
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, state=AgentLineState.WAITING).newest().first()
    story.run(f"agent-line claim {line.id}", actor=story.user)
    story.expect_success("message read 1", actor=story.agent)
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(story.row(AgentLine, line.id).state is not AgentLineState.WAITING)
    reply = story.hook("s-1", HookSamples.edit("src/cart.py"))
    story.expect_rows(not any("new message" in reply_line for reply_line in reply.lines), detail=str(reply.lines))


def test_a_refused_stop_is_not_idle_since_the_agent_goes_on(delivery_typing):
    story, typing = delivery_typing
    post_message(story, "First")
    expect_refusal_hook(story, "s-1")
    post_message(story, "Second")
    expect_row(typing, typed=[])


def test_a_line_is_not_typed_while_the_agent_compacts_and_its_next_hook_gives_it(idle_delivery_typing):
    story, typing = idle_delivery_typing
    story.hook("s-1", COMPACTION)
    post_message(story, "Are you there")
    expect_row(typing, typed=[])
    story.expect_hook_allowed("s-1", HookSamples.edit("cart.py"), "new message 1")


def test_a_compaction_that_sends_no_further_hook_stops_holding_lines_after_its_limit(idle_delivery_typing):
    story, typing = idle_delivery_typing
    story.hook("s-1", COMPACTION)
    story.advance(timedelta(seconds=COMPACTION_LIMIT_SECONDS))
    post_message(story, "Are you there")
    expect_terminal_lines(typing, ["[journal] new message 1"])


def test_a_paused_agent_that_is_idle_is_typed_a_message_so_the_user_can_chat(idle_delivery_typing):
    story, typing = idle_delivery_typing
    agent = story.agent
    story.run(f"agent pause {agent.id}", actor=story.user)
    typing.typed.clear()
    post_message(story, "Are you there")
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])


def test_an_agent_waiting_on_a_question_is_woken_by_a_new_message(delivery_typing):
    story, typing = delivery_typing
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))
    post_message(story, "Use sqlite")
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])


def test_with_no_terminal_the_line_waits_for_the_next_hook(new_story):
    story = delivery_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping(working=False))
    story.hook("s-1", HookSamples.stop())
    post_message(story, "Are you there")
    story.expect_hook_allowed("s-1", HookSamples.prompt("Carry on"), "new message 1")


def test_a_message_is_given_once(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message 1")


def test_the_files_of_a_message_are_named_by_their_path_in_the_line(new_story):
    story = delivery_story(new_story)
    pending = story.home.pending_files / "aaaaaaaaaaaaaaaa"
    pending.mkdir(parents=True)
    (pending / "cart.png").write_bytes(b"png")
    story.run('message send "see this" --file aaaaaaaaaaaaaaaa/cart.png --environment main', actor=story.user)
    expect_reply_line(story.hook("s-1", HookSamples.stop()), "file .journal/files/message/1/cart.png")


def test_a_message_of_the_agent_is_not_given_back_to_it(agent_message):
    story = agent_message
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message")


def test_a_stop_is_refused_while_a_message_is_unread_and_goes_through_once_it_is_read(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "message 1 is unread")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_hook_allowed("s-1", HookSamples.stop())


READ_NUDGE_START = "act on what you read:"


def test_reading_a_message_shows_only_its_text_and_marks_it_read(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    expect_output_5(story, "message read 1", "Fix the cart first")
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_each_new_message_read_in_one_turn_tells_the_agent_how_to_act(new_story):
    story = new_story(SAMPLES, fixture=ReadCartMessage)
    post_message(story, "And the checkout")
    reply = story.hook("s-1", HookSamples.shell("journal message read 2", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "2"], subcommand="message")).with_fields(event="post_tool_use"))
    expect_startswith_lines_reply(READ_NUDGE_START, reply)


def test_the_agent_cannot_show_a_message_it_has_not_read_and_is_told_to_read_it(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    story.expect_hook_refusal("s-1", MESSAGE_DISPLAY_HOOK, "message 1 is unread, so it cannot be shown")
    story.expect_no_text("message show 1", "read_at: 2026", actor=story.user)


def test_the_agent_can_show_a_message_once_it_has_read_it(new_story):
    story = new_story(SAMPLES, fixture=ReadCartMessage)
    expect_absent_reply_refusal(story.hook("s-1", MESSAGE_DISPLAY_HOOK), "is unread")


def test_the_agent_can_show_its_own_message(agent_message):
    story = agent_message
    expect_absent_reply_refusal(story.hook("s-1", MESSAGE_DISPLAY_HOOK), "is unread")


def test_a_reply_read_names_the_message_it_replies_on(new_story):
    story = new_story(SAMPLES, fixture=CartMessage)
    story.run('message reply 1 "And the totals"', actor=story.user)
    expect_output_4(story, "message read 2", ["And the totals", "reply on: message:1"])


def test_a_reply_lands_in_the_environment_of_the_message_it_answers(new_story):
    story = new_story(SAMPLES, fixture=CartMessage)
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
    expect_lines_2(lines, "comment on: report:1")
    expect_lines_without_line(lines, 2, "report:1")


def test_a_message_read_as_one_part_of_a_chain_is_marked_read(new_story):
    story = new_story(SAMPLES, fixture=UnreadCartMessage)
    line = "cat notes && journal message read 1"
    story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["notes"]), ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"])).with_fields(event="post_tool_use"))
    story.expect_text("message show 1", "read_at: 2026", actor=story.user)


def test_a_message_with_an_image_tells_the_agent_to_look_at_it(image_message):
    story = image_message
    story.container.get(Database).connection.execute("UPDATE messages SET files = ? WHERE id = 1", ['["shot.png", "notes.txt"]'])
    lines = story.hook("s-1", READ_MESSAGE_HOOK).lines
    expect_lines_5('message:1 has an image "shot.png": tag it with what it shows', lines)
    expect_absent_notes_lines("notes.txt", "attaches an image", lines)


def test_a_tagged_image_is_not_asked_for_again_and_a_missing_file_is_refused(image_message):
    story = image_message
    story.container.get(Database).connection.execute("UPDATE messages SET files = ? WHERE id = 1", ['["shot.png"]'])
    story.expect_refusal('message tag 1 "other.png" "a cart"', "has no file other.png", actor=story.agent)
    story.run('message tag 1 "shot.png" "the cart with a wrong total"', actor=story.agent)
    story.expect_absent_hook_line("s-1", READ_MESSAGE_HOOK, "attaches an image")


UNREAD_MESSAGE_HOOK = HookSamples.shell("journal message unread", ShellPart("journal", CommandCategory.JOURNAL, ["message", "unread"], subcommand="message")).with_fields(event="post_tool_use")


def test_unread_prints_every_unread_message_and_marks_them_read(new_story):
    story = new_story(SAMPLES, fixture=CartMessage)
    post_message(story, "And the totals")
    reply = story.hook("s-1", HookSamples.stop())
    expect_reply_line(reply, "2 new messages")
    text = story.run("message unread --environment main", actor=story.user)
    text.expect_text("message 1:\nFix the cart")
    text.expect_text("message 2:\nAnd the totals")
    lines = story.hook("s-1", UNREAD_MESSAGE_HOOK).lines
    expect_sum_startswith_lines(READ_NUDGE_START, lines, 1)
    story.expect_text("message show 2", "read_at: 2026", actor=story.user)


def test_the_main_chat_leaves_out_the_marks_of_a_worker(new_story):
    story = delivery_story(new_story)
    main_id = story.container.get(Database).rows(Statement("SELECT id FROM agents WHERE session = 's-1'"))[0]["id"]
    worker = hook_agent(story, story.hook("s-2", HookSamples.session_start()))
    story.container.get(Database).connection.execute("UPDATE agents SET role = 'worker' WHERE id = ?", [worker.id])
    bus, module = story.container.get(Bus), story.container.get(ModuleActors).actor("journal.core.processes")
    bus.run(ShowMark(ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-main", "From the builder", agent_id=main_id), module, environment_id=1)
    bus.run(ShowMark(ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-worker", "From the worker", agent_id=worker.id), module, environment_id=1)
    bus.run(ShowMark(ProcessMarkType.COMMAND, ProcessMarkVariant.FINISHED, "from-nobody", "From the journal"), module, environment_id=1)
    text = story.run("chat-mark main --environment main --json", actor=story.user)
    text.expect_text("From the builder")
    text.expect_text("From the journal")
    text.expect_no_text("From the worker")


def test_a_line_that_only_mentions_the_command_marks_nothing_read(new_story):
    story = new_story(SAMPLES, fixture=CartMessage)
    story.hook("s-1", HookSamples.stop())
    mention = HookSamples.shell('grep -rn "journal message unread" src', ShellPart("grep", CommandCategory.SEARCH, ["-rn"])).with_fields(event="post_tool_use")
    story.hook("s-1", mention)
    story.expect_no_text("message show 1", "read_at: 2026", actor=story.user)


def test_a_message_not_yet_announced_is_not_marked_read_by_unread(new_story):
    story = new_story(SAMPLES, fixture=CartMessage)
    story.hook("s-1", UNREAD_MESSAGE_HOOK.with_fields(event="post_tool_use"))
    post_message(story, "And the totals")
    story.expect_no_text("message show 2", "read_at: 2026", actor=story.user)


def test_editing_a_message_the_agent_read_names_it_to_the_agent_without_its_text(editable_message):
    story = editable_message
    story.hook("s-1", HookSamples.edit("cart.py"))
    story.hook("s-1", READ_MESSAGE_HOOK)
    story.expect_success('message edit 1 --text "Better words"', actor=story.user)
    story.run_listeners()
    lines = story.hook("s-1", HookSamples.edit("cart.py"))
    expect_reply_line(lines, "message:1 updated")
    expect_absent_reply_line(lines, "Better words")


def test_editing_an_unread_message_says_nothing(editable_message):
    story = editable_message
    story.expect_success('message edit 1 --text "Better words"', actor=story.user)
    story.run_listeners()
    story.expect_absent_hook_line("s-1", HookSamples.edit("cart.py"), "updated")


class StoppedLead(StoryFixture):
    """The sample lead has a person, was given a prompt and let to stop, so it sits idle."""

    parent = LeadStarted

    def steps(self, story: Story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.hook("s-1", HookSamples.prompt("[journal] fix the cart"))
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-1")


def stopped_lead_story(new_story):
    return new_story(SAMPLES, fixture=StoppedLead)


class RefusingThenTyping(KeptTyping):
    """Refuses to type until told it may, and counts what it was asked."""

    def __init__(self) -> None:
        super().__init__(working=False)
        self.asked = 0

    def type_line(self, agent_id: int, line: str) -> None:
        self.asked += 1
        super().type_line(agent_id, line)


def test_a_line_that_could_not_be_typed_is_typed_at_a_later_tick_and_then_never_again(new_story):
    story = stopped_lead_story(new_story)
    typing = RefusingThenTyping()
    story.container.bind(TerminalTyping, typing)
    agent = story.agent
    post_message(story, "Are you there")
    expect_row(typing, typed=[])
    typing.working = True
    story.advance(timedelta(seconds=11))
    story.tick("s-1")
    story.run_listeners()
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])
    for _ in range(3):
        story.advance(timedelta(seconds=11))
        story.tick("s-1")
        story.run_listeners()
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])


def test_a_failed_typing_is_asked_again_only_after_ten_seconds(new_story):
    story = stopped_lead_story(new_story)
    typing = RefusingThenTyping()
    story.container.bind(TerminalTyping, typing)
    post_message(story, "Are you there")
    for _ in range(5):
        story.advance(timedelta(seconds=1))
        story.tick("s-1")
        story.run_listeners()
    expect_row(typing, asked=1)
    story.advance(timedelta(seconds=10))
    story.tick("s-1")
    story.run_listeners()
    expect_row(typing, asked=2)


def test_one_line_is_typed_to_an_idle_agent_however_many_messages_wait_and_ticks_pass(new_story):
    story = stopped_lead_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    agent = story.agent
    for number in range(3):
        story.run(f'message send "Message {number}" --environment main', actor=story.user)
    for _ in range(3):
        story.advance(timedelta(seconds=11))
        story.tick("s-1")
        story.run_listeners()
    expect_row(typing, typed=[(agent.id, "[journal] new message 1")])


def test_a_line_the_hook_carries_after_a_failed_typing_is_told_once(untyped_message_after_tick):
    story = untyped_message_after_tick
    lines = story.hook("s-1", HookSamples.prompt("Carry on")).lines
    expect_lines_3(lines, "new message 1", ["new message 1"])
    story.expect_absent_hook_line("s-1", HookSamples.edit("cart.py"), "new message 1")


def test_a_message_read_before_its_line_was_typed_is_never_typed_nor_told_again(new_story):
    story = stopped_lead_story(new_story)
    typing = RefusingThenTyping()
    story.container.bind(TerminalTyping, typing)
    post_message(story, "Are you there")
    story.hook("s-1", READ_MESSAGE_HOOK)
    typing.working = True
    story.advance(timedelta(seconds=11))
    story.tick("s-1")
    story.run_listeners()
    expect_row(typing, typed=[])
    story.expect_absent_hook_line("s-1", HookSamples.prompt("Carry on"), "new message 1")


class UnreadCartMessage(StoryFixture):
    parent = MessagingTurn

    def steps(self, story):
        post_message(story, "Fix the cart first")


class CartMessage(StoryFixture):
    parent = MessagingTurn

    def steps(self, story):
        post_message(story, "Fix the cart")


@pytest.fixture
def delivery_typing(new_story):
    story = delivery_story(new_story)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    return story, typing


@pytest.fixture
def untyped_idle_message(new_story):
    story = stopped_lead_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping(working=False))
    post_message(story, "Are you there")
    story.run_listeners()
    return story


@pytest.fixture
def editable_message(new_story):
    story = delivery_story(new_story)
    story.container.bind(TerminalTyping, KeptTyping())
    post_message(story, "First words")
    return story


@pytest.fixture
def agent_message(new_story):
    story = delivery_story(new_story)
    story.run('message send "On it" --environment main', actor=story.agent)
    return story


class ReadCartMessage(StoryFixture):
    parent = UnreadCartMessage

    def steps(self, story):
        story.hook('s-1', READ_MESSAGE_HOOK)


@pytest.fixture
def image_message(new_story):
    story = delivery_story(new_story)
    post_message(story, "Look at this")
    return story


class StoppedMessagingTurn(StoryFixture):
    parent = MessagingTurn

    def steps(self, story):
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))


@pytest.fixture
def idle_delivery_typing(new_story):
    story = new_story(SAMPLES, fixture=StoppedMessagingTurn)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    return story, typing


@pytest.fixture
def untyped_message_after_tick(new_story):
    story = stopped_lead_story(new_story)
    story.container.bind(TerminalTyping, RefusingThenTyping())
    post_message(story, "Are you there")
    story.advance(timedelta(seconds=11))
    story.tick("s-1")
    story.run_listeners()
    return story


def expect_sum_startswith_lines(item, lines, expected) -> None:
    actual = sum((line.startswith(item) for line in lines))
    assert actual == expected, actual


def expect_absent_notes_lines(text, text_2, lines) -> None:
    actual = any((text in line and text_2 in line for line in lines))
    assert not actual, actual


def expect_lines_5(text, lines) -> None:
    actual = any((line == text for line in lines))
    assert actual, actual


def expect_lines_without_line(lines, number, expected) -> None:
    actual = lines[number:]
    assert not any(expected in line for line in actual), actual


def expect_output_4(story, text, expected) -> None:
    actual = story.run(text, actor=story.user).output_text.splitlines()
    assert actual == expected, actual


def expect_startswith_lines_reply(item, reply) -> None:
    actual = any((line.startswith(item) for line in reply.lines))
    assert actual, actual


def expect_absent_startswith_lines_hook(item, story, text, item_2) -> None:
    actual = any((line.startswith(item) for line in story.hook(text, item_2).lines))
    assert not actual, actual


def expect_output_5(story, text, expected) -> None:
    actual = story.run(text, actor=story.user).output_text.strip()
    assert actual == expected, actual


def expect_hook_lines_typing_without_line(typing, expected) -> None:
    actual = typing.hook_lines
    assert not any(expected in line for line in actual), actual


def expect_terminal_lines(typing, expected) -> None:
    actual = [line for _, line in typing.typed]
    assert actual == expected, actual


def expect_value_7(text, story, text_2, text_3, text_4) -> None:
    actual = text in story.run(text_2, actor=story.user).output_text or text_3 not in story.run(text_4, actor=story.user).output_text
    assert actual, actual
