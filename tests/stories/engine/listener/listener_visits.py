from engine.listener.commit_listener_runner import CommitListenerRunner
from engine.database.database import Database
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value_without, expect_visited_limit

VISITS_LIMIT = 20
READ_POINTS_LIMIT = 60


def test_one_write_visits_only_the_listeners_that_hear_it(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    story.run_listeners()
    visited = []
    original = CommitListenerRunner.run_listener

    def counted(self, entry):
        visited.append(entry.name)
        return original(self, entry)

    monkeypatch.setattr(CommitListenerRunner, "run_listener", counted)
    story.run('reminder make "Look at the cart" --environment main', actor=story.user)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    story.run_listeners()
    cost = database.repeated_work.points().minus(start)
    expect_visited_limit(visited, VISITS_LIMIT)
    expect_total_cost_limit(cost, READ_POINTS_LIMIT)


def test_a_tool_hook_wakes_no_listener_of_a_compaction_or_a_session_start(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    handled = []
    original = CommitListenerRunner.handle_event

    def counted(self, entry, event):
        handled.append(entry.name)
        return original(self, entry, event)

    monkeypatch.setattr(CommitListenerRunner, "handle_event", counted)
    story.hook("s-1", HookSamples.edit("src/cart.py"))
    story.run_listeners()
    expect_value_without(handled, "memories.compaction-fader")
    expect_value_without(handled, "memories.start-memories")


def test_a_listener_that_hears_nothing_moves_over_the_events_and_hears_the_next_it_listens_to(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1", "created")


def expect_total_cost_limit(cost, expected) -> None:
    actual = cost.total
    assert actual <= expected, actual
