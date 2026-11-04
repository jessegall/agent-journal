from dataclasses import replace

from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.registry import Registry
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners
from suites.coding.support.next_task import NextTask
from tests.stories.core.support.coding_fixtures import BuilderStarted


class SecondAssigner:
    """A task assigner of another suite: it hands out nothing by itself."""

    def is_automatic(self, environment_id: int) -> bool:
        return False

    def urgent(self, environment_id: int, excluded_id: int | None = None) -> Task | None:
        return None

    def following(self, environment_id: int, excluded_id: int | None = None) -> Task | None:
        return None


def assigners(story, entry) -> SuiteTaskAssigners:
    registry = story.container.get(Registry)
    suites = tuple(entry if suite.name == entry.name else suite for suite in registry.suites)
    changed = replace(registry, suites=suites)
    return SuiteTaskAssigners(SuiteChoice(changed, story.container.get(SuiteChoice).settings), changed, story.container)


def test_the_coding_suite_names_its_task_assigner(new_story):
    story = new_story(fixture=BuilderStarted)
    assert isinstance(story.container.get(SuiteTaskAssigners).assigner(1), NextTask)


def test_a_suite_names_its_own_task_assigner(new_story):
    story = new_story(fixture=BuilderStarted)
    coding = story.container.get(Registry).suite("coding")
    second = assigners(story, replace(coding, task_assigner=DottedPath.class_path(SecondAssigner).text))
    assert isinstance(second.assigner(1), SecondAssigner)


def test_a_suite_with_no_task_assigner_hands_out_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    coding = story.container.get(Registry).suite("coding")
    assert assigners(story, replace(coding, task_assigner="")).assigner(1) is None
