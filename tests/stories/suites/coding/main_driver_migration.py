from tests.stories.core.support.coding_fixtures import BuilderWithUser, OrchestratorWithOpenTask

AUTO = "journal.suites.coding.auto-mode"


def test_s50_a_fresh_environment_starts_under_the_main_driver(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_s50_the_removed_builder_driver_cannot_be_chosen_again(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("driver choose coding.builder --environment main", "coding.builder", actor=story.user)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_s50_the_removed_orchestrator_driver_cannot_be_chosen_again(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("driver choose coding.orchestrator --environment main", "coding.orchestrator", actor=story.user)
    story.expect_text("suite current main", "main: coding.main", actor=story.user)


def test_s50_choosing_the_main_driver_again_keeps_an_old_auto_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text(f"setting show {AUTO} --environment main", "value: False", actor=story.user)


def test_s50_an_environment_with_auto_off_and_keep_going_on_keeps_its_open_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_text("task show 1", "state: open", actor=story.user)
