import pytest

from engine.actor.actor import Actor
from engine.event.event_log import EventLog
from engine.command.bus import Bus
from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.drivers.commands.prune_events import prune_events_handler
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value
from core.modules.drivers.support.driver_settings import EVENT_COUNT_SETTING

HOOK_CALLS = "hook_calls"
TASKS = "tasks"
MOST_EVENTS = 100


def event_count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement("SELECT count(*) FROM events WHERE row_table = ?", [table]))[0][0]


class HookAndTaskLogged(StoryFixture):
    """A hook call and a task have each logged their changes."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.prompt("go on"))
        story.expect_success('task make "Keep my history" --environment main')

    def expect(self, story: Story) -> None:
        story.expect_rows(event_count(story, HOOK_CALLS) > 0, event_count(story, TASKS) > 0)


def total_events(story) -> int:
    return story.container.get(Database).rows(Statement("SELECT count(*) FROM events"))[0][0]


@pytest.mark.parametrize("kept, is_pruned", [(1, True), (100_000, False)])
def test_the_event_log_keeps_only_the_newest_changes_the_setting_names(new_story, kept, is_pruned):
    story = new_story(fixture=HookAndTaskLogged)
    event_total = total_events(story)
    story.expect_success(f"setting set journal.core.drivers.event-count {kept} --project")
    story.expect_success("event prune")
    expect_value(total_events(story) < event_total, is_pruned)


def test_a_listener_that_has_not_passed_an_event_keeps_it(new_story):
    story = new_story(fixture=HookAndTaskLogged)
    event_total = total_events(story)
    story.container.get(Database).update(Statement("UPDATE listener_cursors SET event_id = 0 WHERE listener = (SELECT min(listener) FROM listener_cursors)"))
    story.container.get(EventLog).prune(1, 0, MOST_EVENTS)
    expect_value(total_events(story), event_total)


def test_one_run_deletes_within_one_window_of_ids(new_story, monkeypatch):
    story = new_story(fixture=HookAndTaskLogged)
    event_total = total_events(story)
    story.expect_success(f"setting set {EVENT_COUNT_SETTING} 1 --project")
    monkeypatch.setattr(prune_events_handler, "WINDOW_IDS", 1)
    story.container.get(Bus).run(PruneEvents(), Actor.core())
    expect_value(total_events(story) >= event_total - 1, True)


def test_the_first_page_of_events_does_not_count_the_table(new_story):
    story = new_story(fixture=HookAndTaskLogged)
    database, statements = story.container.get(Database), []
    original_rows = database.rows
    database.rows = lambda statement: statements.append(statement.sql) or original_rows(statement)
    log = story.container.get(EventLog)
    log.page(1, 1)
    first_page_counts = [sql for sql in statements if "count(*)" in sql]
    statements.clear()
    second_page = log.page(2, 1)
    expect_value((first_page_counts, [sql for sql in statements if "count(*)" in sql] != []), ([], True))
    expect_value(second_page.total, original_rows(Statement("SELECT count(*) FROM events"))[0][0])
