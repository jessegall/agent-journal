from core.base.module.module_removal import ModuleRemoval
from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined

UNDECLARED_HEADING = "Not declared by any installed module"


def story_with_removed_module(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.run("setting set good.limit 60 --project", actor=story.user)
    story.container.get(ModuleRemoval).remove("good")
    story.synced()
    return story


def test_a_sync_reports_the_rows_of_a_removed_module_by_key_and_module_and_deletes_none(new_story):
    story = story_with_removed_module(new_story)
    code, report = story.synced()
    assert code == 0 and "setting good.limit (good) is declared by no installed module" in report, report
    story.expect_text("setting list", "good.limit")


def test_the_tree_lists_the_rows_of_a_removed_module_under_their_own_heading(new_story):
    story = story_with_removed_module(new_story)
    story.expect_ordered_lines("setting tree", UNDECLARED_HEADING, "good.limit: 60", actor=story.user)


def test_a_row_of_a_removed_module_is_readable_and_is_not_set_again(new_story):
    story = story_with_removed_module(new_story)
    story.expect_success("setting show good.limit", "value: 60", "from: project", actor=story.user)
    story.expect_refusal("setting set good.limit 70 --project", "no module declares the setting good.limit", actor=story.user)
    story.expect_success("setting show good.limit", "value: 60", actor=story.user)


def test_a_row_that_is_not_of_its_settings_type_is_reported_at_sync(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.run("setting make good.limit '\"many\"'")
    code, report = story.synced()
    assert code == 0 and "setting good.limit (good) is not a number" in report, report
    story.expect_text("setting list", "good.limit")


def test_a_sync_with_every_row_declared_and_of_its_type_reports_no_setting(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.run("setting set good.limit 60 --project", actor=story.user)
    code, report = story.synced()
    assert code == 0 and "setting " not in report, report
