from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.driver.count_down import CountDown
from core.base.driver.times_span import TimesSpan
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.rules.agent_block_rule import AgentBlockRule
from core.modules.drivers.support.countdowns import Countdowns, condition_unmet
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPEATED = CountDown("stories.repeated", "stop repeating", TimesSpan(3))
SILENT = CountDown("stories.silent", "stop repeating", TimesSpan(3), is_silent=True)
LATE_LINE = CountDown("stories.late_line", "stop repeating", TimesSpan(5), line_limit=2)


def context_of(story) -> Context:
    return Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))


def new_countdowns(story) -> Countdowns:
    return Countdowns(story.container.get(Queries), story.container.get(Repository))


def tick(story, count_down: CountDown, actor_id: int, subject: str = "one", stop_condition=condition_unmet) -> int:
    with story.container.get(Database).transaction():
        return new_countdowns(story).tick(count_down, actor_id, subject, context_of(story), stop_condition)


def test_a_count_survives_between_separate_command_lines(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_rows([tick(story, REPEATED, story.agent.id) for _ in range(3)] == [2, 1, 0])


def test_a_new_subject_starts_the_count_again(new_story):
    story = new_story(fixture=BuilderStarted)
    tick(story, REPEATED, story.agent.id, "one")
    tick(story, REPEATED, story.agent.id, "one")
    story.expect_rows(tick(story, REPEATED, story.agent.id, "two") == 2)


def test_a_reset_starts_the_count_again(new_story):
    story = new_story(fixture=BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    with story.container.get(Database).transaction():
        new_countdowns(story).reset(REPEATED, story.agent.id, context_of(story))
    story.expect_rows(tick(story, REPEATED, story.agent.id) == 2)


def test_a_condition_that_is_true_ends_the_count(new_story):
    story = new_story(fixture=BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    story.expect_rows(tick(story, REPEATED, story.agent.id, stop_condition=lambda: True) == 3)
    story.expect_rows(tick(story, REPEATED, story.agent.id) == 2)


def test_each_actor_counts_on_its_own_whatever_kind_it_is(new_story):
    story = new_story(fixture=BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    story.expect_rows(tick(story, REPEATED, story.user.id) == 2)


def test_a_silent_countdown_says_nothing_at_any_count(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_rows(SILENT.line_at(tick(story, SILENT, story.agent.id)) is None)
    story.expect_rows(SILENT.line_at(0) is None)


def test_a_countdown_says_its_line_only_below_the_count_it_is_given(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_rows(LATE_LINE.line_at(2) is None)
    story.expect_rows(LATE_LINE.line_at(1).text == "stop repeating due: 1 times")


def test_a_block_says_its_countdown_only_below_the_count_it_was_given(new_story):
    story = new_story(fixture=BuilderStarted)
    block = AgentBlock(session_agent_id=story.agent.id, creator_id=story.agent.id, nudge_key="stories.block", nudge_text="held", condition_name="c", condition_text="t",
                       grace_tool_uses=5, countdown_key="stories.block_countdown", countdown_text="left {left}", countdown_limit=2)
    rule = story.container.get(AgentBlockRule)
    story.expect_rows(rule.countdown(block, 2) is None)
    story.expect_rows(rule.countdown(block, 3).text == "left 1")
