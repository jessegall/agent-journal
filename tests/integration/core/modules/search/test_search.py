from tests.stories.core.modules.search.search import expect_fewer_rows_loaded
from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined

LONG_BRIEF = "Before " + "words " * 20 + "the cents   rounding\n\nbreaks " + "after " * 30


def test_a_search_that_matches_nothing_loads_no_whole_rows(played):
    story = played(UserJoined)
    for number in range(30):
        story.run(f'task make "Fix the cart {number}" --environment main', actor=story.user)
    story.expect_text("task show 1", "Fix the cart", actor=story.agent)
    counts = story.container.get(Database).repeated_work
    previous_count = counts.rows
    story.expect_text("search find zebra quartz plume", "nothing here holds all of", actor=story.agent)
    expect_fewer_rows_loaded(counts.rows - previous_count, 100)
