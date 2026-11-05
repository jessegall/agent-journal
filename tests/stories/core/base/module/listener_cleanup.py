import pytest

from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.statement import Statement
from core.base.performance.performance_state import PerformanceState
from server.booting_work import BootingWork
from tests.stories.core.base.module.support.listener_changes import (
    PATH, KeptListener, ListenerChangesModule, OldListener, RenamedListener, SavedListener,
)


@pytest.mark.parametrize("listeners", [[KeptListener], [RenamedListener, KeptListener], [SavedListener, KeptListener]],
                         ids=["removed", "renamed", "changed-to-save"])
def test_sync_removes_the_old_commit_listener_cursor_and_skips(new_story, monkeypatch, listeners):
    story = new_story(PATH)
    cursors = story.container.get(ListenerCursorTable)
    old_position = cursors.position(OldListener.name)
    kept_position = cursors.position(KeptListener.name)
    cursors.failure_count(OldListener.name, old_position)
    cursors.failure_count(KeptListener.name, kept_position)
    monkeypatch.setattr(ListenerChangesModule, "listeners", listeners)

    code, _ = story.synced()

    story.expect_rows(code == 0)
    database = story.container.get(Database)
    cursors = story.container.get(ListenerCursorTable)
    story.expect_rows(OldListener.name not in cursors.positions(), cursors.position(KeptListener.name) == kept_position)
    story.expect_rows(not database.rows(Statement("SELECT * FROM listener_skips WHERE listener = ?", [OldListener.name])))
    story.expect_rows(cursors.failure_count(KeptListener.name, kept_position) == 2)
    if RenamedListener in listeners:
        story.expect_rows(cursors.position(RenamedListener.name) == story.container.get(EventLog).newest_id())


def test_a_stale_listener_cursor_does_not_keep_boot_performance_disabled(new_story, monkeypatch):
    story = new_story(PATH)
    stale_position = story.container.get(ListenerCursorTable).position(OldListener.name)
    monkeypatch.setattr(ListenerChangesModule, "listeners", [KeptListener])
    code, _ = story.synced()
    story.expect_rows(code == 0)

    BootingWork().run(story.container)
    state = story.container.get(PerformanceState)
    story.expect_rows(stale_position < state.boot_event(), state.starting.exists(), not state.can_measure)
    story.run_listeners()

    story.expect_rows(not state.starting.exists(), state.can_measure)
