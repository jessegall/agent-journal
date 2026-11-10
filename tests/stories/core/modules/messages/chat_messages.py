from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.fixtures import UnansweredMessage
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import UserJoined
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def user_story(new_story):
    return new_story(fixture=UserJoined)


def test_a_message_is_sent_as_the_caller_in_the_callers_environment(new_story):
    story = user_story(new_story)
    story.expect_success(lines.USER_MESSAGE, "type: user", "text: Fix the cart first", "environment_id: 1", actor=story.user)
    story.expect_success('message send "On it" --environment main', "type: agent", f"session_agent_id: {story.agent.id}", actor=story.agent)


def test_reading_a_message_marks_it_read_once(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.container.get(Bus).run(ReadMessage(1), story.agent, environment_id=1)
    story.container.get(Bus).run(ReadMessage(1), story.agent, environment_id=1)
    story.expect_success("message show 1", "read_at: 2026-10-31T09:00:00.000000+00:00", "version: 2", actor=story.agent)


def test_an_environments_chat_is_listed_in_the_order_written(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    story.expect_success("message list --environment 1 --oldest", "1  user  Fix the cart first  2026-10-31T09:00:00.000000+00:00  []  {}  []  []", f"2  {story.agent.id}  1  agent  On it  []  {{}}  []  []")


def test_a_message_has_no_make_and_needs_an_environment(new_story):
    story = user_story(new_story)
    story.expect_usage_error('message make "hello"')
    story.expect_refusal('message send "hello"', "a message needs an environment", actor=story.user)


def test_a_redirected_or_piped_message_read_does_not_mark_the_message(new_story):
    story = install_runner(new_story(fixture=UnansweredMessage))
    read = ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")
    story.expect_hook_refusal("s-1", HookSamples.shell("journal message read 1 > /tmp/message", read, redirects=["> /tmp/message"]), "run the read command directly, without a pipe or redirect")
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message", pipe_target=1)
    sink = ShellPart("cat", CommandCategory.READ, [])
    story.expect_hook_refusal("s-1", HookSamples.shell("journal message read 1 && cat", piped, sink), "run the read command directly, without a pipe or redirect")
    story.expect_rows(story.container.get(Queries).query(Message).find(1).read_at is None)
    story.expect_success("message read 1", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Message).find(1).read_at is not None)
