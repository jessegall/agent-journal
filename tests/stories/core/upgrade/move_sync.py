from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.core.upgrade.support.move_samples import PATH

NOTES = f"{PATH}:NotesModule"


def test_a_valid_move_passes_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_success(NOTES)


def test_a_move_reading_the_ids_of_a_module_that_is_not_installed_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:GhostReaderModule", "the move of moveghost reads ids of nothing-installed, which is not installed")


def test_a_move_reading_the_ids_of_a_module_it_does_not_depend_on_is_refused_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:StrangerReaderModule", "the move of movestranger reads ids of journal.core.environments, and movestranger does not depend on it")


def test_a_module_with_its_dependency_and_a_move_reading_that_dependencys_ids_passes_at_sync(new_story):
    new_story(f"{PATH}:NotesModule", fixture=MainEnvironment).expect_sync_success(f"{PATH}:TagsModule")
