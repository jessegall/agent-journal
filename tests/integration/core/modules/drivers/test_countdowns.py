from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.driver.count_down import CountDown
from engine.driver.times_span import TimesSpan
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.support.countdowns import Countdowns, is_unbounded
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPEATED = CountDown("stories.repeated", "stop repeating", TimesSpan(3))
SILENT = CountDown("stories.silent", "stop repeating", TimesSpan(3), is_silent=True)
LATE_LINE = CountDown("stories.late_line", "stop repeating", TimesSpan(5), line_limit=2)


def context_of(story) -> Context:
    return Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))


def new_countdowns(story) -> Countdowns:
    return Countdowns(story.container.get(Queries), story.container.get(Repository))


def tick(story, count_down: CountDown, actor_id: int, subject: str = "one", stop_condition=is_unbounded) -> int:
    with story.container.get(Database).transaction():
        return new_countdowns(story).tick(count_down, actor_id, subject, context_of(story), stop_condition)


def test_a_count_survives_between_separate_command_lines(played):
    story = played(BuilderStarted)
    story.expect_rows([tick(story, REPEATED, story.agent.id) for _ in range(3)] == [2, 1, 0])


def test_a_new_subject_starts_the_count_again(played):
    story = played(BuilderStarted)
    tick(story, REPEATED, story.agent.id, "one")
    tick(story, REPEATED, story.agent.id, "one")
    story.expect_rows(tick(story, REPEATED, story.agent.id, "two") == 2)


def test_a_reset_starts_the_count_again(played):
    story = played(BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    with story.container.get(Database).transaction():
        new_countdowns(story).reset(REPEATED, story.agent.id, context_of(story))
    story.expect_rows(tick(story, REPEATED, story.agent.id) == 2)


def test_a_condition_that_is_true_ends_the_count(played):
    story = played(BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    story.expect_rows(tick(story, REPEATED, story.agent.id, stop_condition=lambda: True) == 3)
    story.expect_rows(tick(story, REPEATED, story.agent.id) == 2)


def test_each_actor_counts_on_its_own_whatever_kind_it_is(played):
    story = played(BuilderStarted)
    tick(story, REPEATED, story.agent.id)
    story.expect_rows(tick(story, REPEATED, story.user.id) == 2)


def test_a_silent_countdown_says_nothing_at_any_count(played):
    story = played(BuilderStarted)
    story.expect_rows(SILENT.line_at(tick(story, SILENT, story.agent.id)) is None)
    story.expect_rows(SILENT.line_at(0) is None)


def test_a_countdown_says_its_line_only_below_the_count_it_is_given(played):
    story = played(BuilderStarted)
    story.expect_rows(LATE_LINE.line_at(2) is None)
    story.expect_rows(LATE_LINE.line_at(1).text == "stop repeating due: 1 times")
