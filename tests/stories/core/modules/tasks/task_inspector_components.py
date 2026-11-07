from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import MainEnvironment

COMPONENTS = ("tasks.task-details", "tasks.task-chain", "tasks.task-log")


def component_windows(story):
    registry = Registry.read(story.container.get(Database))
    return {window.name: window for window in registry.windows if window.name in COMPONENTS}


def test_the_tasks_module_declares_its_inspector_components_as_sections(new_story):
    windows = component_windows(new_story(fixture=MainEnvironment))
    assert sorted(windows) == sorted(COMPONENTS)
    assert all(window.place == "section" and not window.slots and window.module == "journal.core.tasks" for window in windows.values())


def test_the_components_read_and_run_only_what_they_declare(new_story):
    windows = component_windows(new_story(fixture=MainEnvironment))
    assert (tuple(windows["tasks.task-chain"].reads), tuple(windows["tasks.task-log"].reads), tuple(windows["tasks.task-log"].runs)) == (("task graph",), ("task-log list",), ())
    assert (tuple(windows["tasks.task-details"].reads), tuple(windows["tasks.task-details"].runs)) == (("plan place", "task graph"), ("task edit",))
