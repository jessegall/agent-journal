from tests.stories.core.support.coding_fixtures import UserBuilder, OpenTaskOrchestrator

AUTO = "journal.suites.coding.auto-mode"


def test_s50_a_fresh_environment_starts_under_the_main_driver(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_s50_the_removed_builder_driver_cannot_be_chosen_again(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal("driver choose coding.builder --environment main", "coding.builder", actor=story.user)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_s50_choosing_the_main_driver_again_keeps_an_old_auto_off(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text(f"setting show {AUTO} --environment main", "value: False", actor=story.user)
