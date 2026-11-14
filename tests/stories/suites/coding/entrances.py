from engine.database.database import Database
from engine.registry.registry import Registry
from suites.coding.coding_suite import CodingSuite
from suites.coding.entrances.admin_entrance import AdminEntrance
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.suites.coding.support.entrance_samples import FrontDeskSuite, ReviewEntrance

SAMPLES = "tests.stories.suites.coding.support.entrance_samples"


def entrances_of(story, suite: str) -> dict[str, tuple[str, ...]]:
    return dict(Registry.read(story.container.get(Database)).suite(suite).entrances)


def test_581_the_coding_suite_lists_its_windows_in_the_admin_entrance(new_story):
    story = new_story(fixture=CodingEnvironment)
    entrances = entrances_of(story, CodingSuite.name)
    story.expect_rows(list(entrances) == [AdminEntrance.key], entrances[AdminEntrance.key] == tuple(AdminEntrance.windows), detail=str(list(entrances)))


def test_581_a_second_entrance_is_a_second_class_the_registry_reads_beside_the_admin_entrance(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_sync_success(f"{SAMPLES}:FrontDeskSuite")
    entrances = entrances_of(story, FrontDeskSuite.name)
    story.expect_rows(list(entrances) == [AdminEntrance.key, ReviewEntrance.key], entrances[ReviewEntrance.key] == ("messages.chat", "tasks.tasks"), detail=str(entrances))
