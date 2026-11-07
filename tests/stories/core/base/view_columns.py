from tests.stories.core.base.support.view_samples import EXTRA_COLUMN, MISSING_COLUMN
from tests.unit.core.base.module.test_module_sync import ITEMS


def test_a_view_model_naming_a_column_its_select_lacks_is_refused_at_sync(new_story):
    story = new_story(ITEMS)
    story.expect_sync_refusal(MISSING_COLUMN, "ItemTitle.title has no column in item_titles")


def test_a_select_with_a_column_its_view_model_lacks_is_refused_at_sync(new_story):
    story = new_story(ITEMS)
    story.expect_sync_refusal(EXTRA_COLUMN, "item_states.title has no field in ItemState")
