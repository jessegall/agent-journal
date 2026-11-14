from engine.database.database import Database
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_endswith_authorization, expect_startswith_listed, expect_value_with, expect_value_without, expect_visited_limit

LONG_BRIEF = "Before " + "words " * 20 + "the cents   rounding\n\nbreaks " + "after " * 30
























def expect_fewer_rows_loaded(loaded, limit) -> None:
    assert loaded < limit, loaded


def test_a_search_that_matches_nothing_loads_no_whole_rows(played):
    story = played(UserJoined)
    for number in range(30):
        story.run(f'task make "Fix the cart {number}" --environment main', actor=story.user)
    story.expect_text("task show 1", "Fix the cart", actor=story.agent)
    counts = story.container.get(Database).repeated_work
    previous_count = counts.rows
    story.expect_text("search find zebra quartz plume", "nothing here holds all of", actor=story.agent)
    expect_fewer_rows_loaded(counts.rows - previous_count, 100)
