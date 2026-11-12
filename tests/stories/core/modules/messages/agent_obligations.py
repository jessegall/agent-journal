from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.agents.models.agent import Agent
from core.modules.chat.models.journal_exception import JournalException
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.read_limit import READ_LIMIT_ROWS, limit_reads
from tests.stories.core.modules.messages.reply_teaching import READ_MESSAGE, VIEW_LINE, ReplySession, journal_line, listeners_run_at_hook  # noqa: F401

HELPER_SESSION = "s-2"
WORKER_SESSION = "s-worker"
HOLD = "answer message 1 first"
EDIT = HookSamples.edit("src/cart.py")


class HelperBeside(StoryFixture):
    """The main agent of the reply stories with a helper agent of its own, each with a session."""

    parent = ReplySession

    def steps(self, story):
        story.helper = Actor(story.new_row_id(f"agent start {HELPER_SESSION} claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.hook(HELPER_SESSION, HookSamples.session_start())


class WorkerBeside(StoryFixture):
    """The coding suite's main agent with a worker of its own, session s-worker."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(f"agent start {WORKER_SESSION} claude worker --parent {story.agent.id} --environment main", actor=story.user)


def beside_story(new_story):
    """The story clock starts again after a fixture, so it moves past the sessions' start before a message is read."""
    story = new_story(SAMPLES, fixture=HelperBeside)
    story.advance(timedelta(seconds=30))
    return story


def use_tools(story, session: str, count: int) -> None:
    for _ in range(count):
        story.hook(session, VIEW_LINE)


def test_a_worker_messaged_by_its_main_agent_is_held_after_the_countdown_and_freed_by_its_reply(new_story):
    story = new_story(fixture=WorkerBeside)
    story.advance(timedelta(seconds=30))
    worker = Actor(story.story_rows(Agent, role="worker")[0].id, ActorType.AGENT)
    story.expect_success(f'message send "Look at src/cart.py again" --to agent:{agent_number(story, worker.id)}', actor=story.agent)
    story.expect_success("message read 1", actor=worker)
    story.expect_hook_allowed(WORKER_SESSION, VIEW_LINE, "answer message 1 before you go on")
    use_tools(story, WORKER_SESSION, 12)
    story.expect_hook_refusal(WORKER_SESSION, EDIT, HOLD)
    story.expect_success(f'message send "On it" --to agent:{agent_number(story, story.agent.id)}', actor=worker)
    story.expect_absent_hook_line(WORKER_SESSION, EDIT, "answer message 1")


def test_a_main_agent_messaged_by_a_worker_is_held_after_the_countdown_and_freed_by_its_reply(new_story):
    story = beside_story(new_story)
    story.expect_success(f'message send "The total is wrong" --to agent:{agent_number(story, story.agent.id)}', actor=story.helper)
    story.expect_success("message read 1", actor=story.agent)
    story.expect_hook_allowed("s-1", VIEW_LINE, "answer message 1 before you go on")
    use_tools(story, "s-1", 12)
    story.expect_hook_refusal("s-1", EDIT, HOLD)
    story.expect_success('message reply 1 "Fixing it"', actor=story.agent)
    story.expect_absent_hook_line("s-1", EDIT, "answer message 1")


def test_a_person_messaging_an_agent_holds_it_as_before(new_story):
    story = beside_story(new_story)
    story.expect_success('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.hook("s-1", READ_MESSAGE)
    use_tools(story, "s-1", 12)
    story.expect_hook_refusal("s-1", EDIT, HOLD)


def test_a_journal_line_holds_nobody(new_story):
    story = beside_story(new_story)
    story.expect_success('message send "The tests passed" --environment main', actor=Actor.core())
    story.hook("s-1", journal_line("journal message read 1").with_fields(event="post_tool_use"))
    use_tools(story, "s-1", 12)
    story.expect_absent_hook_line("s-1", EDIT, "answer message 1")


def test_a_main_agent_that_wrote_many_messages_since_an_answered_report_is_checked_within_the_read_limit(new_story):
    story = beside_story(new_story)
    story.expect_success(f'message send "Read the cart" --to agent:{agent_number(story, story.helper.id)}', actor=story.agent)
    story.expect_success(f'message send "The total is wrong" --to agent:{agent_number(story, story.agent.id)}', actor=story.helper)
    story.expect_success("message read 2", actor=story.agent)
    story.expect_success('message reply 2 "Fixing it"', actor=story.agent)
    for number in range(READ_LIMIT_ROWS + 10):
        story.expect_success(f'message send "Step {number} is done" --environment main', actor=story.agent)
    limit_reads(story)
    story.expect_absent_hook_line("s-1", EDIT, "answer message 2")
    story.expect_rows(story.story_rows(JournalException) == (), detail=str(story.story_rows(JournalException)))


def test_a_helper_that_wrote_many_messages_since_an_answered_one_is_checked_within_the_read_limit(new_story):
    story = beside_story(new_story)
    story.expect_success(f'message send "Read the totals" --to agent:{agent_number(story, story.helper.id)}', actor=story.agent)
    story.expect_success("message read 1", actor=story.helper)
    story.expect_success(f'message send "Reading it" --to agent:{agent_number(story, story.agent.id)}', actor=story.helper)
    for number in range(READ_LIMIT_ROWS + 10):
        story.expect_success(f'message send "Step {number} is done" --to agent:{agent_number(story, story.agent.id)}', actor=story.helper)
    limit_reads(story)
    story.expect_absent_hook_line(HELPER_SESSION, EDIT, "answer message")
    story.expect_rows(story.story_rows(JournalException) == (), detail=str(story.story_rows(JournalException)))


def test_a_report_read_before_the_main_agent_started_again_waits_on_no_reply_after_the_restart(new_story):
    story = beside_story(new_story)
    story.expect_success(f'message send "The cart is done" --to agent:{agent_number(story, story.agent.id)}', actor=story.helper)
    story.expect_success("message read 1", actor=story.agent)
    story.expect_hook_allowed("s-1", VIEW_LINE, "answer message 1 before you go on")
    story.advance(timedelta(minutes=5))
    story.hook("s-1", HookSamples.session_start())
    story.advance(timedelta(seconds=30))
    story.expect_absent_hook_line("s-1", EDIT, "answer message 1")
