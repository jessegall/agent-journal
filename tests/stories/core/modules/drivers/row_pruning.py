from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.ticks.row_pruning import RowPruning
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]


class OldPromptLogged(StoryFixture):
    """The agent's prompt was logged as a hook call with its lines."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.prompt("an old prompt"))

    def expect(self, story: Story) -> None:
        story.expect_rows(count(story, "hook_calls") > 0)


def test_rows_past_the_newest_kept_go_without_an_event_and_the_newest_stay(new_story, monkeypatch):
    story = new_story(fixture=OldPromptLogged)
    story.hook("s-1", HookSamples.prompt("a new prompt"))
    monkeypatch.setattr(HookCall, "kept_rows", 1)
    events = count(story, "events")
    RowPruning()(story.container)
    expect_value((count(story, "hook_calls"), count(story, "events") <= events), (1, True))


def test_a_hook_call_a_waiting_line_still_points_at_stays(new_story, monkeypatch):
    story = new_story(fixture=OldPromptLogged)
    story.container.get(Database).update(Statement("UPDATE agent_lines SET state = 'waiting' WHERE hook_call_id IS NOT NULL"))
    held = story.container.get(Database).rows(Statement("SELECT count(DISTINCT hook_call_id) FROM agent_lines WHERE hook_call_id IS NOT NULL"))[0][0]
    monkeypatch.setattr(HookCall, "kept_rows", 0)
    RowPruning()(story.container)
    expect_value(count(story, "hook_calls") >= held, True)
