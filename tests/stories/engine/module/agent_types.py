import pytest

from engine.helper_type.helper_type_book import HelperTypeBook
from tests.stories.core.support.fixtures import MainEnvironment


MODULES = "tests.stories.engine.module.support.agent_type_modules"


@pytest.mark.parametrize(("module", "message"), [
    ("Duplicate", "the main agent is no helper; a module or suite registers helper types only"),
    ("InvalidKey", "lowercase letters and dashes"),
    ("MissingLabel", "no label"),
    ("MissingDependency", "does not depend on journal.core.agents"),
    ("InvalidRoster", "roster does not implement AgentRoster"),
    ("UnknownBase", "extends missing-base, which no module registers"),
    ("Loop", "extends loop"),
    ("WritingHelper", "writing helper needs its own folder"),
    ("WritingDescendant", "writing helper needs its own folder"),
    ("DriverRole", "missing-driver-role is no registered helper type"),
    ("DefaultRole", "missing-default-role is no registered helper type"),
    ("PolicyRole", "missing-policy-role is no registered helper type"),
    ("RuleRole", "missing-rule-role is no registered helper type"),
])
def test_sync_refuses_an_invalid_helper_type_before_writing_the_registry(new_story, module, message):
    story = new_story()
    story.expect_sync_refusal(f"{MODULES}:{module}", message)


def test_a_registered_type_survives_registry_storage_and_can_start(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{MODULES}:Clerk")
    book = story.container.get(HelperTypeBook)
    clerk = book.find("clerk")
    story.expect_rows(clerk.module == "sample.clerk", clerk.label == "Clerk",
                      book.extends("clerk", "helper"), "clerk" in book.helper_keys(), book.is_helper("clerk"), not book.is_helper("main"),
                      "main" not in tuple(entry.key for entry in book.startable()),
                      clerk.roster is not None, story.container.get(clerk.roster.loaded()).available(1) == ())
    story.expect_success("agent start clerk-session claude clerk --environment main", "role: clerk")


def test_an_unregistered_role_cannot_start(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_usage_error("agent start unknown-session claude missing-role --environment main")


def test_a_suite_registers_a_helper_type_through_the_module_funnel(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{MODULES}:SuiteRegistersHelperType")
    book = story.container.get(HelperTypeBook)
    story.expect_rows(book.find("suite-clerk").module == "sample.clerk", book.is_helper("suite-clerk"))
