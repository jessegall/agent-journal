from engine.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value

COMPONENTS = ("tasks.task-details", "tasks.task-chain", "tasks.task-log")


def component_windows(story):
    registry = Registry.read(story.container.get(Database))
    return {window.name: window for window in registry.windows if window.name in COMPONENTS}


def test_the_tasks_module_declares_its_inspector_components_as_sections(new_story):
    windows = component_windows(new_story(fixture=MainEnvironment))
    expect_value(sorted(windows), sorted(COMPONENTS))
    expect_value(bool(all(window.place == "section" and not window.slots and window.module == "journal.core.tasks" for window in windows.values())), True)


def test_the_components_read_and_run_only_what_they_declare(new_story):
    windows = component_windows(new_story(fixture=MainEnvironment))
    expect_value((tuple(windows["tasks.task-chain"].reads), tuple(windows["tasks.task-log"].reads), tuple(windows["tasks.task-log"].runs)), (tuple(["task graph"]), tuple(["task-log list"]), ()))
    expect_value((tuple(windows["tasks.task-details"].reads), tuple(windows["tasks.task-details"].runs)), (tuple(["plan place"]), tuple(["task edit"])))
