import pytest

from core.base.agent_type_book import AgentTypeBook
from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import MainEnvironment


MODULES = "tests.stories.core.base.module.support.agent_type_modules"


@pytest.mark.parametrize(("module", "message"), [
    ("Duplicate", "journal.core.agents registers that agent type too"),
    ("InvalidKey", "lowercase letters and dashes"),
    ("MissingLabel", "no label"),
    ("MissingDependency", "does not depend on journal.core.agents"),
    ("InvalidRoster", "roster does not implement AgentRoster"),
    ("UnknownBase", "extends missing-base, which no module registers"),
    ("Loop", "extends loop"),
    ("WritingHelper", "writing helper needs its own folder"),
    ("WritingDescendant", "writing helper needs its own folder"),
    ("DriverRole", "missing-driver-role is no registered agent type"),
    ("DefaultRole", "missing-default-role is no registered agent type"),
    ("PolicyRole", "missing-policy-role is no registered agent type"),
    ("RuleRole", "missing-rule-role is no registered agent type"),
])
def test_sync_refuses_an_invalid_agent_type_before_writing_the_registry(new_story, module, message):
    story = new_story()
    registry = Registry.read(story.container.get(Database)).entries_text()
    code, text = story.synced_with(f"{MODULES}:{module}")
    story.expect_rows(code != 0, message in text,
                      Registry.read(story.container.get(Database)).entries_text() == registry)


def test_a_registered_type_survives_registry_storage_and_can_start(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{MODULES}:Clerk")
    book = story.container.get(AgentTypeBook)
    clerk = book.find("clerk")
    story.expect_rows(clerk.module == "sample.clerk", clerk.label == "Clerk",
                      book.extends("clerk", "helper"), "clerk" in book.kinds_of("helper"),
                      "main" not in tuple(entry.key for entry in book.startable()),
                      clerk.roster is not None, story.container.get(clerk.roster.loaded()).available(1) == ())
    story.expect_success("agent start clerk-session claude clerk --environment main", "role: clerk")


def test_an_unregistered_role_cannot_start(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_usage_error("agent start unknown-session claude missing-role --environment main")
