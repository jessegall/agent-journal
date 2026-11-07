from tests.stories.core.support.coding_fixtures import BuilderWithUser, OrchestratorWithOpenTask

AUTO = "journal.suites.coding.auto-mode"


def test_s50_the_builder_driver_name_is_still_chosen_and_read_back(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("driver choose coding.builder --environment main", actor=story.user)
    story.expect_text("suite current main", "main: coding.builder", actor=story.user)


def test_s50_the_orchestrator_driver_name_is_still_chosen_and_read_back(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("driver choose coding.orchestrator --environment main", actor=story.user)
    story.expect_text("suite current main", "main: coding.orchestrator", actor=story.user)


def test_s50_an_environment_moves_to_the_main_driver_and_keeps_an_old_auto_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text(f"setting show {AUTO} --environment main", "value: False", actor=story.user)


def test_s50_an_orchestrator_environment_moves_to_the_main_driver_and_keeps_its_open_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    story.expect_text("task show 1", "state: open", actor=story.user)
