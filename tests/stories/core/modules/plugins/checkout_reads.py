import pytest

from core.base.database.database import Database
from engine.model.tables import Tables
from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.modules.plugins.support.checkout_stories import ORDER, checkout_story, edit_event, removed_worktree_rows
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_row, real

REMOVED_COUNT = 300
MOST_WORKTREE_ROWS = 6


def worktree_rows_read(story, work) -> int:
    table = story.container.get(Tables).table(Worktree).name
    return sum(rows for statement, rows in work.statements.items() if f"FROM {table}" in statement)


@pytest.mark.story_budget(cpu_seconds=8.0, reason="it adds 300 removed worktrees to prove a delivery reads only the worktrees that hold the file")
def test_a_delivery_with_a_file_reads_a_handful_of_worktree_rows_among_300_removed_ones(new_story):
    story = checkout_story(new_story)
    removed_worktree_rows(story, REMOVED_COUNT)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    call = edit_event(story, story.worker_session)
    rows_read = worktree_rows_read(story, database.repeated_work.points().minus(start))
    story.expect_rows(checkout_row(call)["root"] == real(story.worktree), 0 < rows_read <= MOST_WORKTREE_ROWS, detail=f"{rows_read} worktree rows read")
