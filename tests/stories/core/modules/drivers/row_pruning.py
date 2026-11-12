from datetime import timedelta

from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.ticks.row_pruning import RowPruning
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

KEPT_PAST = timedelta(days=4)


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]


class OldPromptLogged(StoryFixture):
    """The agent's prompt was logged as a hook call with its lines."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.prompt("an old prompt"))

    def expect(self, story: Story) -> None:
        story.expect_rows(count(story, "hook_calls") > 0)


def test_rows_past_their_kept_time_go_without_an_event_and_recent_rows_stay(new_story):
    story = new_story(fixture=OldPromptLogged)
    story.advance(KEPT_PAST)
    story.hook("s-1", HookSamples.prompt("a new prompt"))
    calls, events = count(story, "hook_calls"), count(story, "events")
    RowPruning()(story.container)
    expect_value((count(story, "hook_calls") < calls, count(story, "hook_calls") > 0, count(story, "events") <= events), (True, True, True))


def test_a_hook_call_a_waiting_line_still_points_at_stays(new_story):
    story = new_story(fixture=OldPromptLogged)
    story.container.get(Database).update(Statement("UPDATE agent_lines SET state = 'waiting' WHERE hook_call_id IS NOT NULL"))
    held = story.container.get(Database).rows(Statement("SELECT count(DISTINCT hook_call_id) FROM agent_lines WHERE hook_call_id IS NOT NULL"))[0][0]
    story.advance(KEPT_PAST)
    RowPruning()(story.container)
    expect_value(count(story, "hook_calls") >= held, True)
