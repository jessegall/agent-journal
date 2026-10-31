from tests.core.base.module.test_module_sync import ITEMS


def test_a_small_modules_row_is_made_and_shown_through_the_command_line(new_story):
    story = new_story(ITEMS)
    story.expect_success('item make "Dune"', "title: Dune", "state: open")
    story.expect_success("item show 1", "id: 1", "created_at: 2026-10-31T09:00:00.000000+00:00")
    story.expect_refusal('item make "Dune"', "an item with that title exists already")
